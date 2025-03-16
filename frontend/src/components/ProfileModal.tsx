import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form, message } from "antd";
import axios from "axios";

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isVisible, onClose }) => {
  const [profile, setProfile] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          message.error("No authentication token found. Please log in again.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        message.error("Failed to fetch profile. Please try again.");
      }
    };

    if (isVisible) {
      fetchProfile();
    }
  }, [isVisible]);

  const handleEditClick = () => setIsEditing(true);

  const handleSave = async (values: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("No authentication token found. Please log in again.");
        return;
      }

      await axios.put("http://localhost:5000/api/auth/profile", values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Profile updated successfully.");
      onClose(); 
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Modal title="Admin Profile" visible={isVisible} onCancel={onClose} footer={null}>
      <Form layout="vertical" initialValues={profile} onFinish={handleSave} disabled={!isEditing}>
        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please enter your first name" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please enter your last name" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>

        <Button type="default" onClick={handleEditClick} style={{ marginRight: 10 }} disabled={isEditing}>
          Edit
        </Button>
        <Button type="primary" htmlType="submit" disabled={!isEditing}>
          Save
        </Button>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
