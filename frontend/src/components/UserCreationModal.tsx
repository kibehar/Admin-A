import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { createUser } from "../api/api"; 
import "../styles/UserCreationStyles.css"; 

const UserCreation: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await createUser(values);
      message.success("User created successfully");
    } catch (error: any) {
      message.error(error.response?.data?.error || "User creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-creation-container">
      <h2>Create User</h2>
      <Form layout="vertical" onFinish={onFinish} className="user-form">
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Required" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Required" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid email" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Required" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Required" }]}>
              <Input.Password className="dashed-input" />
            </Form.Item>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select a role" }]}>
              <Input className="dashed-input" />
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="black-button">
            Create User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserCreation;
