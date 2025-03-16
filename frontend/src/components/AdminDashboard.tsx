import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import ProfileModal from "./ProfileModal";  
import "../styles/dashstyles.css";
const { Header, Content, Footer } = Layout;

const AdminDashboard: React.FC = () => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  return (
    <Layout>
      <Header className="dashboard-header">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} className="dashboard-header-menu">
          <Menu.Item key="1"><Link to="/home">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/users">User</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/report">Report</Link></Menu.Item>
          <Menu.Item key="4">
            <button onClick={() => setIsProfileModalVisible(true)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              Profile
            </button>
          </Menu.Item>
        </Menu>
      </Header>

      <Layout>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <h2>Welcome to the Admin Dashboard</h2>
          </Content>
        </Layout>
      </Layout>

      <Footer className="dashboard-footer">
        <p>Admin Panel Footer - © 2025</p>
      </Footer>

      <ProfileModal isVisible={isProfileModalVisible} onClose={() => setIsProfileModalVisible(false)} />
    </Layout>
  );
};

export default AdminDashboard;
