import React, { useEffect, useState, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUsers, getInventory, getSales, getWarehouses } from "../api/api"; 
import AdminLayout from "../components/AdminLayout";
import { Table, Card, Statistic, Row, Col, Tag } from "antd";
import { UserOutlined, ShoppingCartOutlined, AppstoreOutlined, RiseOutlined, CheckCircleOutlined, ClockCircleOutlined, CreditCardOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalInventoryItems, setTotalInventoryItems] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [paidSales, setPaidSales] = useState(0);
  const [unpaidSales, setUnpaidSales] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [warehouseSalesData, setWarehouseSalesData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const userData = await getUsers(1, 100);
      setUsers(userData.users);
      setTotalUsers(userData.total);

      const inventoryData = await getInventory();
      setInventory(inventoryData);
      setTotalInventoryItems(inventoryData.length);
      setLowStockItems(inventoryData.filter((item: any) => item.stock < 80));

      const salesData = await getSales();
      setSales(salesData);
      setTotalSales(salesData.length);

      const currentMonth = dayjs().month();
      const currentMonthSales = salesData.filter((sale: any) => dayjs(sale.saleDate).month() === currentMonth);
      setMonthlySales(currentMonthSales.length);

      const paid = salesData.filter((sale: any) => sale.paymentStatus === "Paid").length;
      const unpaid = salesData.filter((sale: any) => sale.paymentStatus !== "Paid").length;
      setPaidSales(paid);
      setUnpaidSales(unpaid);

      const warehouseData = await getWarehouses();
      setWarehouses(warehouseData);

      const warehouseSales = warehouseData.map((warehouse: any) => {
        const salesFromWarehouse = salesData.filter((sale: any) => sale.warehouseId?._id === warehouse._id);
        const totalAmount = salesFromWarehouse.reduce((sum: number, sale: any) => sum + sale.total, 0);
        return {
          name: warehouse.name,
          total: totalAmount,
        };
      });
      setWarehouseSalesData(warehouseSales);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: 20 }}>Welcome, Admin!</h2>
      <p style={{ fontSize: 16, color: "#666" }}>Here’s your system's overview with real-time data.</p>

      {}
      <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Total Users" value={totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Total Sales" value={totalSales} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Inventory Items" value={totalInventoryItems} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Monthly Sales" value={monthlySales} prefix={<RiseOutlined />} />
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
        <Col span={12}>
          <Card bordered={false} style={{ background: "#E3FCEF" }}>
            <Statistic title="Paid Sales" value={paidSales} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} style={{ background: "#FFE2E2" }}>
            <Statistic title="Unpaid Sales" value={unpaidSales} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={16} style={{ marginBottom: 30 }}>
        <Col span={12}>
          <Card bordered={false}>
            <h3>Low Stock Items</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={lowStockItems} dataKey="stock" nameKey="name" outerRadius={100} fill="#8884d8">
                  {lowStockItems.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card bordered={false}>
            <h3>Total Amount Sold by Warehouse</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseSalesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false} title="🛒 Recent Sales" extra={<CreditCardOutlined />}>
            <Table
              dataSource={sales.slice(0, 5)}
              columns={[
                { title: "Product", dataIndex: ["productId", "name"], key: "product" },
                { title: "Customer", dataIndex: "customerName", key: "customer" },
                { title: "Total", dataIndex: "total", key: "total" },
                { 
                  title: "Payment", 
                  dataIndex: "paymentStatus", 
                  key: "paymentStatus",
                  render: (status) => (
                    <Tag color={status === "Paid" ? "green" : status === "Partial" ? "gold" : "red"}>
                      {status}
                    </Tag>
                  ),
                },
              ]}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card bordered={false} title="📦 Recently Added Items" extra={<AppstoreOutlined />}>
            <Table
              dataSource={inventory.slice(0, 5)}
              columns={[
                { title: "Name", dataIndex: "name", key: "name" },
                { title: "Category", dataIndex: "category", key: "category" },
                { title: "Stock", dataIndex: "stock", key: "stock" },
              ]}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;
