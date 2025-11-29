import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  MoneyCollectOutlined,
  BankOutlined,
  LineChartOutlined,
  AccountBookOutlined,
  NotificationOutlined,
  UserOutlined,
  RollbackOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import "./Layout.scss";
import image from "../assets/payfona.png";

const { Header, Sider, Content } = Layout;

const MianLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOnline, setOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnlineStatus = () => setOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="offline-container">
        <span className="offline-container-text">
          You’re offline, no internet connection
        </span>
      </div>
    );
  }

  const menuItems = [
    { key: "1", label: "Dashboard", icon: <LineChartOutlined />, path: "/" },
    {
      key: "2",
      label: "Customers",
      icon: <AccountBookOutlined />,
      path: "/customers",
    },
    {
      key: "3",
      label: "Invoice",
      icon: <MoneyCollectOutlined />,
      path: "/invoices",
    },
    {
      key: "4",
      label: "Subscriptions",
      icon: <AccountBookOutlined />,
      path: "/subscriptions",
    },
    {
      key: "5",
      label: "Transactions",
      icon: <CreditCardOutlined />,
      path: "/transactions",
    },
    {
      key: "6",
      label: "Bank Accounts",
      icon: <BankOutlined />,
      path: "/accounts",
    },
    {
      key: "7",
      label: "Invoice Refunds",
      icon: <RollbackOutlined />,
      path: "/invoice-refunds",
    },
    {
      key: "8",
      label: "Log Out",
      icon: <LogoutOutlined />,
      path: "/login",
      logout: true,
    },
  ];

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        className="side-bar"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="logo">
          <img src={image} className="brand-logo" alt="Northern Breeze" />
        </div>
        <Menu mode="vertical">
          {menuItems.map(({ key, label, icon, path, logout }) => (
            <Menu.Item
              key={key}
              icon={icon}
              onClick={() => {
                if (logout) localStorage.clear();
                navigate(path);
              }}
            >
              {label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-header"
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: "#31004a" }} />
              ) : (
                <MenuFoldOutlined style={{ color: "#31004a" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <div>
            <Button
              type="text"
              icon={<NotificationOutlined style={{ color: "#31004a" }} />}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <Button
              type="text"
              icon={<UserOutlined style={{ color: "#31004a" }} />}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{ padding: 24, minHeight: "100vh", overflowY: "scroll" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MianLayout;
