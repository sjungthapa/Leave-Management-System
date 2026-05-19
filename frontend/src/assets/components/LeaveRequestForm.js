import { Button, DatePicker, Form, Input } from "antd";
import { CalendarOutlined, FileTextOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const LeaveRequestForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { dates, reason } = values;
    const [start, end] = dates;
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const res = await axios.post(
        "/api/leaves",
        {
          startDate: start.format("YYYY-MM-DD"),
          endDate: end.format("YYYY-MM-DD"),
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Leave request submitted successfully! Admin will be notified via email.", {
        duration: 4000,
        icon: '✅',
      });
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish} 
      style={{ maxWidth: 800 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Form.Item
          name="dates"
          label={
            <span style={{ fontWeight: 500, fontSize: 14 }}>
              <CalendarOutlined /> Select Date Range
            </span>
          }
          rules={[{ required: true, message: "Please select date range" }]}
        >
          <RangePicker 
            style={{ width: "100%" }} 
            size="large"
            format="MMM DD, YYYY"
          />
        </Form.Item>
        
        <Form.Item style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            block
            style={{ height: 44 }}
          >
            Submit Leave Request
          </Button>
        </Form.Item>
      </div>

      <Form.Item
        name="reason"
        label={
          <span style={{ fontWeight: 500, fontSize: 14 }}>
            <FileTextOutlined /> Reason for Leave
          </span>
        }
        rules={[
          { required: true, message: "Please provide a reason" },
          { min: 10, message: "Reason must be at least 10 characters" }
        ]}
      >
        <TextArea 
          rows={4} 
          placeholder="Please provide a detailed reason for your leave request..."
          showCount
          maxLength={500}
        />
      </Form.Item>
    </Form>
  );
};

export default LeaveRequestForm;
