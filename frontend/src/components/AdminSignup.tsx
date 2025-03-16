import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { adminSignup } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/AuthStyles.css"; 

const AdminSignup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();
  const verificationCode = "123456"; 

  const onFinish = async (values: any) => {
    setLoading(true);
    setErrorMessage(""); 

    if (values.verificationCode !== verificationCode) {
      message.error("Invalid verification code!");
      setLoading(false);
      return;
    }

    try {
      await adminSignup(values);
      message.success("Signup successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      const responseError = error.response?.data?.error || "Signup failed";
      setErrorMessage(responseError); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Signup</h2>
      <Form layout="vertical" onFinish={onFinish} className="auth-form">
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="Verification Code" name="verificationCode" rules={[{ required: true, message: "Required" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Required" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Required" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid email" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Required" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Required" }]}>
              <Input.Password className="dashed-input" />
            </Form.Item>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: "Required" }]}>
              <Input.Password className="dashed-input" />
            </Form.Item>
          </div>
        </div>

        {}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="black-button">
            Signup
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminSignup;
