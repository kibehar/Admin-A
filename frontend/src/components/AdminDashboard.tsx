import React, { useEffect, useState, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUsers } from "../api/api"; // Import API function
import AdminLayout from "../components/AdminLayout";
import { Table } from "antd";

// Define User Type
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roleData, setRoleData] = useState<{ name: string; value: number }[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Use useCallback to memoize fetchUsers to avoid unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers(1, 100); // Fetch up to 100 users
      setUsers(data.users);
      setTotalUsers(data.total);

      // Count roles for the chart
      const roleCounts: Record<string, number> = {};
      data.users.forEach((user: User) => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });

      // Convert to chart-friendly format
      const formattedRoleData = Object.entries(roleCounts).map(([role, count]) => ({
        name: role,
        value: count,
      }));

      setRoleData(formattedRoleData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // ✅ Added fetchUsers as a dependency

  // Colors for the Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <AdminLayout>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Overview of users and roles in the system.</p>

      {/* Total Users */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
        <div style={{ padding: 20, background: "#f0f2f5", borderRadius: 10 }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{totalUsers}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Pie Chart - User Roles */}
        <div style={{ width: "45%", background: "#fff", padding: 20, borderRadius: 10 }}>
          <h3>User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                {roleData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - User Roles */}
        <div style={{ width: "45%", background: "#fff", padding: 20, borderRadius: 10 }}>
          <h3>User Role Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users Table */}
      <div style={{ marginTop: 30 }}>
        <h3>Recently Added Users</h3>
        <Table
          dataSource={users.slice(0, 5)}
          rowKey="_id"
          columns={[
            { title: "First Name", dataIndex: "firstName" },
            { title: "Last Name", dataIndex: "lastName" },
            { title: "Email", dataIndex: "email" },
            { title: "Role", dataIndex: "role" },
          ]}
          pagination={false}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
