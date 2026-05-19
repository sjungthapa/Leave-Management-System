import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from "axios";
import toast from "react-hot-toast";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registerData } = values;
      
      const response = await axios.post('/api/auth/user/register', registerData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        form.resetFields();
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Registration failed");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match!'));
    },
  });

  return (
    <div className="authentication" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="authentication-form card" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        background: 'white'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Create Account
        </h1>
        
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Full Name" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="Email Address" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Password" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              validateConfirmPassword,
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Confirm Password" 
              size="large"
            />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
            loading={loading}
            style={{ marginTop: '10px' }}
          >
            Register
          </Button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 'bold' }}>Login</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Register;