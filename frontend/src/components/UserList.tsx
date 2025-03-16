import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Select } from "antd";
import { getUsers, deleteUser } from "../api/api"; 

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      const filteredUsers = roleFilter
        ? response.filter((user: any) => user.role === roleFilter)
        : response;
      setUsers(filteredUsers);
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

  return (
    <div>
      <Select
        style={{ width: 200, marginBottom: 20 }}
        placeholder="Filter by Role"
        onChange={(value) => setRoleFilter(value)}
        value={roleFilter}
      >
        <Select.Option value="Worker 1">Worker 1</Select.Option>
        <Select.Option value="Worker 2">Worker 2</Select.Option>
      </Select>

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

export default UserList;
