import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Link, useNavigate } from "react-router-dom";
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
} from "@ant-design/icons";
import "./Layout.scss";
import image from "../assets/payfona.png";

const { Header, Sider, Content } = Layout;

const MianLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOnline, setOnline] = useState(navigator.onLine);

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

  const logOutHandler = () => {
    //
  };

  const menuItems = [
    { key: "/", label: <Link to="/">Home</Link>, icon: <LineChartOutlined /> },
    {
      key: "/customers",
      label: <Link to="/customers">Customers</Link>,
      icon: <AccountBookOutlined />,
    },
    {
      key: "/invoices",
      label: <Link to="/invoices">Invoices</Link>,
      icon: <MoneyCollectOutlined />,
    },
    {
      key: "/invoice-refunds",
      label: <Link to="/invoice-refunds">Invoice Refunds</Link>,
      icon: <RollbackOutlined />,
    },
    {
      key: "/subscriptions",
      label: <Link to="/subscriptions">Subscriptions</Link>,
      icon: <AccountBookOutlined />,
      path: "subscriptions",
    },
    {
      key: "/accounts",
      label: <Link to="/accounts">Bank Accounts</Link>,
      icon: <BankOutlined />,
    },
    {
      key: "logout",
      label: <Button onClick={logOutHandler}>Logout</Button>,
      icon: <LogoutOutlined />,
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
        <Menu items={menuItems} />
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
