import { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Modal, Descriptions, Spin } from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";

const AdminLeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const token = localStorage.getItem("token");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/leaves", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      setActionLoading(leaveId);
      await axios.put(
        `/api/leaves/${leaveId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const statusText = status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Leave ${statusText} successfully! Email notification sent to employee.`, {
        duration: 4000,
        icon: status === 'approved' ? '✅' : '❌',
      });
      
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${status} leave`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = (leave) => {
    setSelectedLeave(leave);
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: ["user", "name"],
      key: "userName",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "userEmail",
      render: (text) => <span style={{ color: '#8c8c8c' }}>{text}</span>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => moment(text).format("MMM DD, YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("MMM DD, YYYY"),
    },
    {
      title: "Days",
      key: "days",
      render: (_, record) => {
        const days = moment(record.endDate).diff(moment(record.startDate), "days") + 1;
        return <Tag color="blue">{days} {days === 1 ? 'day' : 'days'}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "approved" ? "success" : status === "rejected" ? "error" : "warning";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record._id, "approved")}
                size="small"
                loading={actionLoading === record._id}
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record._id, "rejected")}
                size="small"
                loading={actionLoading === record._id}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">All Leave Requests</h1>
        <p className="page-subtitle">Review and manage employee leave requests</p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#8c8c8c' }}>Loading leave requests...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={leaves}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} requests`
            }}
          />
        )}
      </div>

      <Modal
        title={<span style={{ fontSize: 20, fontWeight: 600 }}>Leave Request Details</span>}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={650}
      >
        {selectedLeave && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Employee Name">
              <span style={{ fontWeight: 500 }}>{selectedLeave.user?.name}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedLeave.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {moment(selectedLeave.startDate).format("MMMM DD, YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {moment(selectedLeave.endDate).format("MMMM DD, YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Total Days">
              <Tag color="blue">
                {moment(selectedLeave.endDate).diff(moment(selectedLeave.startDate), "days") + 1} days
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Reason">
              <div style={{ whiteSpace: 'pre-wrap' }}>{selectedLeave.reason}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedLeave.status === "approved"
                    ? "success"
                    : selectedLeave.status === "rejected"
                    ? "error"
                    : "warning"
                }
              >
                {selectedLeave.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Requested On">
              {moment(selectedLeave.createdAt).format("MMMM DD, YYYY [at] HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminLeaveList;