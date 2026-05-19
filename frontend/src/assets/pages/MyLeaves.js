import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Form, DatePicker, Select, Input, Spin } from "antd";
import { EditOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/leaves/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filteredLeaves =
    filteredStatus === "all"
      ? leaves
      : leaves.filter((leave) => leave.status === filteredStatus);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Delete Leave Request',
      content: 'Are you sure you want to delete this leave request?',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setActionLoading(id);
          await axios.delete(`/api/leaves/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Leave request deleted successfully!", {
            icon: '🗑️',
          });
          fetchLeaves();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete leave");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    form.setFieldsValue({
      dates: [moment(leave.startDate), moment(leave.endDate)],
      reason: leave.reason,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.dates;
      
      setActionLoading(editingLeave._id);
      await axios.put(
        `/api/leaves/${editingLeave._id}`,
        {
          startDate: start.format("YYYY-MM-DD"),
          endDate: end.format("YYYY-MM-DD"),
          reason: values.reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success("Leave request updated successfully!", {
        icon: '✏️',
      });
      setEditModalVisible(false);
      fetchLeaves();
    } catch (err) {
      if (err.errorFields) {
        toast.error("Please fill in all required fields");
      } else {
        toast.error(err.response?.data?.message || "Failed to update leave");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (text) => moment(text).format("MMM DD, YYYY"),
      sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
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
      title: "Reason",
      dataIndex: "reason",
      ellipsis: true,
      render: (text) => (
        <span style={{ color: '#4a4a4a' }}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = status === "approved" ? "success" : status === "rejected" ? "error" : "warning";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {record.status === "pending" && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
              loading={actionLoading === record._id}
            >
              Edit
            </Button>
          )}
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            size="small"
            loading={actionLoading === record._id}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const calendarEvents = leaves.map((leave) => ({
    title: `${leave.status.toUpperCase()} - ${leave.reason.substring(0, 20)}${leave.reason.length > 20 ? '...' : ''}`,
    start: leave.startDate,
    end: moment(leave.endDate).add(1, "day").format("YYYY-MM-DD"),
    backgroundColor:
      leave.status === "approved" ? "#52c41a" : leave.status === "rejected" ? "#ff4d4f" : "#faad14",
    borderColor: "transparent",
  }));

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">My Leave Requests</h1>
        <p className="page-subtitle">View and manage your leave requests</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: '#1a1a1a' }}>
            Leave History
          </h2>
          <Select
            value={filteredStatus}
            onChange={setFilteredStatus}
            style={{ width: 200 }}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#8c8c8c' }}>Loading your leaves...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredLeaves}
            rowKey="_id"
            pagination={{ 
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} requests`
            }}
          />
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined /> Calendar View
        </h2>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          height={600}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
        />
      </div>

      <Modal
        title={<span style={{ fontSize: 20, fontWeight: 600 }}>Edit Leave Request</span>}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Update Leave"
        confirmLoading={actionLoading === editingLeave?._id}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="dates"
            label="Select Date Range"
            rules={[{ required: true, message: "Please select dates" }]}
          >
            <RangePicker style={{ width: '100%' }} size="large" />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason for Leave"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <TextArea rows={4} placeholder="Enter reason for leave..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyLeaves;
