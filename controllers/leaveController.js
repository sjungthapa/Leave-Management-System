const Leave = require("../models/Leave");
const User = require("../models/User");
const sendEmail = require("../utils/SendEmail");

// Create a leave request
exports.createLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Dates and reason are required", success: false });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date must be after or equal to start date", success: false });
    }

    const user = await User.findById(req.userId);
    
    const leave = await Leave.create({
      user: req.userId,
      startDate,
      endDate,
      reason,
    });

    // Send email notification to admins
    try {
      const admins = await User.find({ role: "admin" });
      
      const emailMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1890ff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #1890ff; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 4px; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Leave Request</h1>
            </div>
            <div class="content">
              <p>Hello Admin,</p>
              <p>A new leave request has been submitted and requires your approval.</p>
              
              <div class="details">
                <h3>Request Details:</h3>
                <p><strong>Employee:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> ${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} days</p>
                <p><strong>Reason:</strong> ${reason}</p>
              </div>
              
              <p>Please log in to the system to approve or reject this request.</p>
              
              <p>Best regards,<br>Leave Management System</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      for (const admin of admins) {
        await sendEmail({
          email: admin.email,
          subject: `New Leave Request from ${user.name}`,
          message: emailMessage,
        });
      }
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ message: "Leave requested", success: true, data: leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

// Get all leaves (Admin only)
exports.getAllLeaves = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Admin access required", success: false });
    }

    const leaves = await Leave.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

// Get leaves for logged-in user
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

// Get all approved leaves (for calendar view)
exports.getCalendarLeaves = async (req, res) => {
  try {
    // Show all APPROVED leaves to everyone
    const leaves = await Leave.find({ status: "approved" }).populate("user", "name email");

    // Format leaves for calendar
    const calendarLeaves = leaves.map(leave => ({
      id: leave._id,
      title: `${leave.user.name}'s Leave`,
      start: leave.startDate,
      end: leave.endDate,
      userName: leave.user.name,
      reason: leave.reason,
    }));

    res.status(200).json({ success: true, data: calendarLeaves });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

// Update leave (User can edit their own pending leaves)
exports.updateLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found", success: false });
    }

    if (leave.user.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (leave.status !== "pending" && req.userRole !== "admin") {
      return res.status(400).json({ message: "Cannot edit approved/rejected leaves", success: false });
    }

    if (startDate) leave.startDate = startDate;
    if (endDate) leave.endDate = endDate;
    if (reason) leave.reason = reason;

    await leave.save();
    res.status(200).json({ message: "Leave updated", success: true, data: leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

// Update leave status (Admin only)
exports.updateLeaveStatus = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Admin access required", success: false });
    }

    const { status } = req.body;
    const leave = await Leave.findById(req.params.id).populate("user", "name email");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found", success: false });
    }

    leave.status = status;
    await leave.save();

    // Send email notification to user
    try {
      const statusText = status === "approved" ? "Approved" : "Rejected";
      const statusColor = status === "approved" ? "#52c41a" : "#ff4d4f";
      
      const emailMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: ${statusColor}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid ${statusColor}; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .status-badge { display: inline-block; padding: 8px 16px; background-color: ${statusColor}; color: white; border-radius: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Leave Request ${statusText}</h1>
            </div>
            <div class="content">
              <p>Hello ${leave.user.name},</p>
              <p>Your leave request has been <span class="status-badge">${statusText.toUpperCase()}</span></p>
              
              <div class="details">
                <h3>Leave Details:</h3>
                <p><strong>Start Date:</strong> ${new Date(leave.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${new Date(leave.endDate).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> ${leave.reason}</p>
                <p><strong>Status:</strong> ${statusText}</p>
              </div>
              
              ${status === "approved" 
                ? '<p>Your leave has been approved. Enjoy your time off!</p>' 
                : '<p>Your leave request has been rejected. Please contact your administrator for more information.</p>'
              }
              
              <p>Best regards,<br>Leave Management System</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        email: leave.user.email,
        subject: `Leave Request ${statusText} - ${new Date(leave.startDate).toLocaleDateString()}`,
        message: emailMessage,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({ message: "Leave updated", success: true, data: leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

// Delete leave (User or Admin)
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found", success: false });
    }

    if (leave.user.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    await leave.deleteOne();
    res.status(200).json({ message: "Leave deleted", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};
