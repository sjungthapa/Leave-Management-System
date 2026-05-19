import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Divider, message } from 'antd';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import axios from 'axios';

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', values);
  
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name);
        
        // Trigger auth change event
        window.dispatchEvent(new Event('authChange'));
        
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Login failed");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/auth/google-login', {
        token: credentialResponse.credential,
      });
  
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userName', response.data.user.name);
        
        // Trigger auth change event
        window.dispatchEvent(new Event('authChange'));
        
        toast.success('Google login successful!');
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId="591061101925-anru8d8tue4gqriij2e78fj5bu6p8rq8.apps.googleusercontent.com">
      <div className='authentication' style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className='authentication-form card' style={{
          maxWidth: '450px',
          width: '100%',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          background: 'white'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            Welcome Back
          </h1>
          
          <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item 
              name="email"
              label='Email'
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder='Email' 
                size="large"
              />
            </Form.Item>
            
            <Form.Item 
              name="password"
              label='Password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder='Password' 
                size="large"
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type='primary' 
                htmlType='submit' 
                block
                size="large"
                loading={loading}
                style={{ marginTop: '10px' }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Divider>OR</Divider>
          
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => message.error('Google login failed')}
            width="100%"
            size="large"
            shape="rectangular"
            text="signin_with"
          />
          
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to='/register' style={{ fontWeight: 'bold' }}>Register</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;