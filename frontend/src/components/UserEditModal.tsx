import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { updateUser } from "../api/api"; 

interface UserEditModalProps {
  visible: boolean;
  user: any | null;
  onClose: () => void;
  onUpdate: () => void; 
}

const UserEditModal: React.FC<UserEditModalProps> = ({ visible, user, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    }
  }, [user, form]);

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      await updateUser(user._id, values);
      message.success("User updated successfully");
      onUpdate(); 
      onClose(); 
    } catch (error: any) {
      message.error(error.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit User" open={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Required" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Required" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "Required" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={[{ required: true, message: "Required" }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
