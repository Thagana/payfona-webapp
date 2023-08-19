import * as React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "antd/es/menu";
import Layout from "antd/es/layout";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  MoneyCollectOutlined,
  HomeOutlined,
  BankOutlined,
  ShopOutlined,
  AccountBookOutlined,
  NotificationOutlined,
  UserOutlined,
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
  const profile = useStoreState<Model>((state) => state.profile);

  const navigate = useNavigate();
  const toggleNav = () => {
    setCollapsed(!collapsed);
  };

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
          backgroundColor: "#31004a",
        }}
      >
        <div className="logo">
          <img src={image} className="brand-logo" alt="Northern Breeze" />
        </div>
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={[defaultIndex]}>
          <Menu.Item
            key="1"
            icon={<HomeOutlined />}
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<MoneyCollectOutlined />}
            onClick={() => {
              navigate("/invoices");
            }}
          >
            Invoice
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
            key="3"
            icon={<BankOutlined />}
            onClick={() => {
              navigate("/accounts");
            }}
          >
            Bank Accounts
          </Menu.Item>
          <Menu.Item
            key="8"
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
                  <MenuUnfoldOutlined color="#fff" />
                ) : (
                  <MenuFoldOutlined color="#fff" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "#fff",
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
                color: "#fff",
              }}
            />
            <Button
              type="text"
              icon={<UserOutlined color="#fff" />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "#fff",
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
