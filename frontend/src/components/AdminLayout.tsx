import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { UserOutlined, BarChartOutlined, HomeOutlined } from "@ant-design/icons";
import "../styles/dashstyles.css";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="dashboard-sidebar">
        <div className="logo">Admin Dashboard</div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}><Link to="/dashboard">Home</Link></Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}><Link to="/users">User</Link></Menu.Item>
          <Menu.Item key="3" icon={<BarChartOutlined />}><Link to="/report">Report</Link></Menu.Item>
          <Menu.Item key="4" onClick={() => setIsProfileModalVisible(true)} icon={<UserOutlined />}>
            Profile
          </Menu.Item>
        </Menu>
      </Sider>

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
          {children} {}
        </Content>

        {}
        <Footer className="dashboard-footer">
          <p>Admin Footer</p>
        </Footer>
      </Layout>

      <ProfileModal isVisible={isProfileModalVisible} onClose={() => setIsProfileModalVisible(false)} />
    </Layout>
  );
};

export default AdminLayout;
