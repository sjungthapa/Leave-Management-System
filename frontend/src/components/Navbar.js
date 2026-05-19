import React from "react";
import { Layout, Menu, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, CalendarOutlined, UnorderedListOutlined, LogoutOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    
    // Trigger auth change event
    window.dispatchEvent(new Event('authChange'));
    
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/Myleaves",
      icon: <CalendarOutlined />,
      label: "My Leaves",
    },
  ];

  if (userRole === "admin") {
    menuItems.push({
      key: "/adminleavelist",
      icon: <UnorderedListOutlined />,
      label: "All Leaves (Admin)",
    });
  }

  return (
    <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#001529" }}>
      <div style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
        Leave Management System
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, minWidth: 0, marginLeft: "20px" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {userName && <span style={{ color: "white" }}>Welcome, {userName}</span>}
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;
