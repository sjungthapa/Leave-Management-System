import LeaveRequestForm from "../components/LeaveRequestForm";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Badge, Tooltip, Spin } from "antd";
import toast from "react-hot-toast";
import moment from "moment";

const LeaveCalendar = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await axios.get("/api/leaves/calendar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeaves(res.data.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error(error.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const filteredLeaves = leaves.filter((leave) => {
      const start = moment(leave.start).format("YYYY-MM-DD");
      const end = moment(leave.end).format("YYYY-MM-DD");
      return formattedDate >= start && formattedDate <= end;
    });

    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filteredLeaves.map((leave) => (
          <li key={leave.id} style={{ marginBottom: 4 }}>
            <Tooltip title={`${leave.userName}: ${leave.reason}`} placement="top">
              <Badge 
                status="error" 
                text={
                  <span style={{ 
                    fontSize: 12, 
                    color: '#667eea',
                    fontWeight: 500 
                  }}>
                    {leave.userName}
                  </span>
                } 
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Leave Management System</h1>
        <p className="page-subtitle">Request leave and view approved leaves on the calendar</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1a1a1a' }}>
          Request New Leave
        </h2>
        <LeaveRequestForm onSuccess={fetchLeaves} />
      </div>

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1a1a1a' }}>
          Calendar - Approved Leaves
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#8c8c8c' }}>Loading calendar...</p>
          </div>
        ) : (
          <Calendar dateCellRender={dateCellRender} />
        )}
      </div>
    </div>
  );
};

export default LeaveCalendar;
