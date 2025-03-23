import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, message } from "antd";
import { getUsers, deleteUser } from "../api/api"; 
import UserEditModal from "./UserEditModal"; 

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any | null>(null); // Track selected user for editing
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Track modal visibility

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(currentPage, 5);
      setUsers(response.users);
      setTotalUsers(response.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user");
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalVisible(true);
  };

  return (
    <div>
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

      <Pagination
        current={currentPage}
        pageSize={5}
        total={totalUsers}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />

      {/* User Edit Modal */}
      {selectedUser && (
        <UserEditModal
          visible={isEditModalVisible}
          user={selectedUser}
          onClose={() => setIsEditModalVisible(false)}
          onUpdate={fetchUsers} // Refresh the user list after update
        />
      )}
    </div>
  );
};

export default UserList;

