import * as React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "antd/es/menu";
import Layout from "antd/es/layout";
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
  RollbackOutlined
} from "@ant-design/icons";

import "./Template.scss";
import { useStoreState } from "easy-peasy";
import { Model } from "../store/model";

import image from "../assets/payfona.png";
import SubMenu from "antd/es/menu/SubMenu";
import Button from "antd/es/button";

const { Header, Sider, Content } = Layout;

type Props = {
  children: React.ReactNode;
  defaultIndex: string;
};

export default function TemplateWrapper(props: Props): JSX.Element {
  const { children, defaultIndex } = props;
  const [collapsed, setCollapsed] = React.useState(false);
  const [isOnline, setOnline] = React.useState(true);

  const navigate = useNavigate();

  window.addEventListener("online", () => {
    setOnline(true);
  });

  window.addEventListener("offline", () => {
    setOnline(false);
  });
  
  React.useEffect(() => {
    setOnline(navigator.onLine);
  }, []);

  if (!isOnline) {
    return (
      <div className="offline-container">
        <span className="offline-container-text">
          Your offline, no internet connection
        </span>
      </div>
    );
  }

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="side-bar"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <div className="logo">
          <img src={image} className="brand-logo" alt="Northern Breeze" />
        </div>
        <Menu mode="vertical" defaultSelectedKeys={[defaultIndex]}>
          <Menu.Item
            key="1"
            icon={<LineChartOutlined />}
            onClick={() => {
              navigate("/");
            }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<AccountBookOutlined />}
            onClick={() => {
              navigate("/customers");
            }}
          >
            Customers
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<MoneyCollectOutlined />}
            onClick={() => {
              navigate("/invoices");
            }}
          >
            Invoice
          </Menu.Item>
          <Menu.Item
            key="7"
            icon={<RollbackOutlined />}
            onClick={() => {
              navigate("/invoice-refunds");
            }}
          >
            Invoice Refunds
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<AccountBookOutlined />}
            onClick={() => {
              navigate("/subscriptions");
            }}
          >
            Subscriptions
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<BankOutlined />}
            onClick={() => {
              navigate("/accounts");
            }}
          >
            Bank Accounts
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            LogOut
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header" style={{ padding: 0 }}>
          <div>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined color="#31004a" />
                ) : (
                  <MenuFoldOutlined color="#31004a" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "#31004a",
              }}
            />
          </div>
          <div>
            <Button
              type="text"
              icon={<NotificationOutlined color="#fff" />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "#31004a",
              }}
            />
            <Button
              type="text"
              icon={<UserOutlined color="#31004a" />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "#31004a",
              }}
            />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: "100vh",
            overflowY: "scroll",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
