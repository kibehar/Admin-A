import React, { useEffect, useState, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUsers } from "../api/api"; 
import AdminLayout from "../components/AdminLayout";
import { Table, Card, Statistic, Row, Col, Tag } from "antd";
import { UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, CreditCardOutlined } from "@ant-design/icons";

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

  const totalOrders = 120;
  const deliveredOrders = 90;
  const pendingOrders = totalOrders - deliveredOrders;
  const totalRevenue = 50000;
  const monthlyGrowth = 8.5;

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers(1, 100);
      setUsers(data.users);
      setTotalUsers(data.total);

      const roleCounts: Record<string, number> = {};
      data.users.forEach((user: User) => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });

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
  }, [fetchUsers]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: 20 }}>👋 Welcome, Admin!</h2>
      <p style={{ fontSize: 16, color: "#666" }}>Here's an overview of the system's performance.</p>

      {}
      <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Total Users" value={totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Total Orders" value={totalOrders} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Total Revenue" value={`$${totalRevenue}`} prefix={<DollarCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Monthly Growth"
              value={`${monthlyGrowth}%`}
              valueStyle={{ color: monthlyGrowth > 0 ? "green" : "red" }}
            />
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
        <Col span={12}>
          <Card bordered={false} style={{ background: "#E3FCEF" }}>
            <Statistic title="Delivered Orders" value={deliveredOrders} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} style={{ background: "#FFE2E2" }}>
            <Statistic title="Pending Orders" value={pendingOrders} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={16} style={{ marginBottom: 30 }}>
        {}
        <Col span={12}>
          <Card bordered={false}>
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
          </Card>
        </Col>

        {}
        <Col span={12}>
          <Card bordered={false}>
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
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={16} style={{ marginBottom: 30 }}>
        {}
        <Col span={12}>
          <Card bordered={false} title="💳 Recent Transactions" extra={<CreditCardOutlined />}>
            <Table
              dataSource={[
                { key: "1", orderId: "ORD123", customer: "John Doe", amount: "$250", status: "Completed" },
                { key: "2", orderId: "ORD124", customer: "Alice Smith", amount: "$120", status: "Pending" },
                { key: "3", orderId: "ORD125", customer: "Michael Brown", amount: "$450", status: "Completed" },
                { key: "4", orderId: "ORD126", customer: "Emily Johnson", amount: "$320", status: "Failed" },
              ]}
              columns={[
                { title: "Order ID", dataIndex: "orderId" },
                { title: "Customer", dataIndex: "customer" },
                { title: "Amount", dataIndex: "amount" },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (status) => (
                    <Tag color={status === "Completed" ? "green" : status === "Pending" ? "gold" : "red"}>{status}</Tag>
                  ),
                },
              ]}
              pagination={false}
            />
          </Card>
        </Col>

        {}
        <Col span={12}>
          <Card bordered={false} title="🆕 Recently Added Users" extra={<UserOutlined />}>
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
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;
