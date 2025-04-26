import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import {
  UserOutlined,
  BarChartOutlined,
  HomeOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import "../styles/dashstyles.css";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const selectedKey = location.pathname.split("/")[1] || "dashboard"; 

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="dashboard-sidebar"
      >
        <div className="logo">Admin Dashboard</div>

        {}
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/dashboard">Home</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/users">User</Link>
          </Menu.Item>
          <Menu.Item key="report" icon={<BarChartOutlined />}>
            <Link to="/report">Report</Link>
          </Menu.Item>
          <Menu.Item key="inventory" icon={<InboxOutlined />}>
            <Link to="/inventory">Inventory</Link>
          </Menu.Item>
          <Menu.Item key="sale" icon={<InboxOutlined />}>
            <Link to="/sales">Sales</Link>
            </Menu.Item>
            <Menu.Item key="warehouse" icon={<InboxOutlined />}>
            <Link to="/warehouse">Warehouse</Link>
            </Menu.Item>
            <Menu.Item key="supplier" icon={<InboxOutlined />}>
            <Link to="/supplier">Supplier</Link>
            </Menu.Item>
          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            onClick={() => setIsProfileModalVisible(true)}
          >
            Profile
          </Menu.Item>
        </Menu>
      </Sider>

      {}
      <Layout>
        {}
        <Header className="dashboard-header">
          <div className="header-content">
            <Button className="profile-btn" onClick={() => setIsProfileModalVisible(true)}>
              Profile
            </Button>
          </div>
        </Header>

        {}
        <Content className="dashboard-content">
          {children}
        </Content>

        {}
        <Footer className="dashboard-footer">
          <p>Admin Footer</p>
        </Footer>
      </Layout>

      {}
      <ProfileModal
        isVisible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />
    </Layout>
  );
};

export default AdminLayout;
