import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Modal, Input, Select } from "antd";
import { getUsers, deleteUser } from "../api/api";
import UserCreation from "./UserCreationModal";
import UserEditModal from "./UserEditModal";
import AdminLayout from "../components/AdminLayout";
import "../styles/dashstyles.css";

const { Search } = Input;
const { Option } = Select;

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchText, setSearchText] = useState(""); 
  const [selectedRole, setSelectedRole] = useState("");
  const pageSize = 5;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchText, selectedRole]); 
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(currentPage, pageSize, searchText, selectedRole);
      setUsers(data.users);
      setTotalUsers(data.total);
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

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalVisible(true);
  };

  return (
    <AdminLayout>
      {/* 🔍 Search and Filter UI */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Search
          placeholder="Search by name, email, username"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Filter by Role"
          onChange={(value) => setSelectedRole(value)}
          style={{ width: 200 }}
          allowClear
        >
          <Option value="">All Roles</Option>
          <Option value="Worker 1">Worker 1</Option>
          <Option value="Worker 2">Worker 2</Option>
        </Select>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>Create User</Button>
      </div>

      {/* 🔽 Create User Modal */}
      <Modal title="Create User" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} width={800}>
        <UserCreation />
      </Modal>

      {/* 🏁 User Table */}
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
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
                  Edit
                </Button>
                <Button onClick={() => handleDelete(record._id)} danger>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      {/* 📌 Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalUsers}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />

      {/* ✏️ Edit User Modal */}
      <UserEditModal
        visible={isEditModalVisible}
        user={selectedUser}
        onClose={() => setIsEditModalVisible(false)}
        onUpdate={fetchUsers}
      />
    </AdminLayout>
  );
};

export default UserPage;
