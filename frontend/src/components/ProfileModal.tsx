import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form, message, Spin } from "antd";
import { getAdminProfile, updateAdminProfile } from "../api/api";

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getAdminProfile();
        form.setFieldsValue(profileData);
      } catch (error) {
        message.error("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchProfile();
    }
  }, [isVisible, form]);

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await updateAdminProfile(values);
      message.success("Profile updated successfully.");
      setIsEditing(false);
      onClose();
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Admin Profile" visible={isVisible} onCancel={onClose} footer={null}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please enter your first name" }]}>
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please enter your last name" }]}>
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
            <Input disabled={!isEditing} />
          </Form.Item>

          <Form.Item label="New Password" name="newPassword">
            <Input.Password disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirmNewPassword">
            <Input.Password disabled={!isEditing} />
          </Form.Item>

          <Button type="default" onClick={() => setIsEditing(true)} style={{ marginRight: 10 }} disabled={isEditing}>
            Edit
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={!isEditing}>
            Save
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default ProfileModal;
