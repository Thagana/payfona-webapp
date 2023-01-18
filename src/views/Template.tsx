import * as React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "antd/es/menu";
import Layout from "antd/es/layout";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionOutlined,
  MoneyCollectOutlined,
  HomeOutlined,
  ScanOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import "./Template.scss";
import { useStoreState } from "easy-peasy";
import { Model } from "../store/model";

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
        <span>Your offline, no internet connection</span>
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
      >
        <div className="logo">
          <img
            src={profile.avatar}
            className="brand-logo"
            alt="Northern Breeze"
          />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultIndex]}>
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
            icon={<ScanOutlined />}
            onClick={() => {
              navigate("/scan");
            }}
          >
            Scan
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<SearchOutlined />}
            onClick={() => {
              navigate("/search");
            }}
          >
            Search
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              navigate("/about");
            }}
          >
            About 2tip
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<QuestionOutlined />}
            onClick={() => {
              navigate("/help");
            }}
          >
            Help
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<MoneyCollectOutlined />}
            onClick={() => {
              navigate("/transactions");
            }}
          >
            Transactions
          </Menu.Item>
          <Menu.Item
            key="7"
            icon={<UserOutlined />}
            onClick={() => {
              navigate("/profile");
            }}
          >
            Profile
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
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggleNav,
            }
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
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
