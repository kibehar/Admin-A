import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Modal } from "antd";
import { getUsers, deleteUser } from "../api/api"; 
import UserCreation from "./UserCreationModal"; 

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false); 

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(); 
      setUsers(response.data); 
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="black-button" style={{ marginBottom: 20 }}>
        Create User
      </Button>

      {}
      <Modal
        title="Create User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} 
        width={800} 
      >
        <UserCreation />
      </Modal>

      {}
      <Table
        dataSource={users}
        loading={loading}
        rowKey="_id"
        pagination={false}
        columns={[
          { title: "First Name", dataIndex: "firstName" },
          { title: "Last Name", dataIndex: "lastName" },
          { title: "Email", dataIndex: "email" },
          { title: "Username", dataIndex: "username" },
          { title: "Role", dataIndex: "role" },
          {
            title: "Actions",
            render: (text, record) => (
              <Button onClick={() => handleDelete(record._id)}>Delete</Button>
            ),
          },
        ]}
      />

      {}
      <Pagination
        current={currentPage}
        pageSize={5}
        total={50} 
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default UserPage;
