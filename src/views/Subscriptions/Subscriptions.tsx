import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { AllSubscriptions } from "./Tabs/AllSubscriptions";
import SubscriptionRequests from "./Tabs/SubscriptionRequests";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Subscriptions",
    children: <AllSubscriptions />,
  },
  {
    key: "2",
    label: "Subscription Request",
    children: <SubscriptionRequests />,
  },
];

export default function Subscriptions() {
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} centered />
  );
}
