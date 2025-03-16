import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { adminLogin } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/AuthStyles.css"; 

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    setErrorMessage(""); 

    try {
      const response = await adminLogin(values);
      localStorage.setItem("token", response.data.token);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const responseError = error.response?.data?.error || "Login failed";
      setErrorMessage(responseError); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>
      <Form layout="vertical" onFinish={onFinish} className="auth-form">
        <Form.Item label="Email or Username" name="emailOrUsername" rules={[{ required: true, message: "Required" }]}>
          <Input className="dashed-input" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Required" }]}>
          <Input.Password className="dashed-input" />
        </Form.Item>

        {}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="black-button">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminLogin;
