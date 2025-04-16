import { Tag } from 'antd/es';
import { ColumnsType } from "antd/es/table"
import { InvoiceType } from "../interface/Invoice"
import { getColorFromStatus } from '../helper/getColorFromState';
import { LinkOutlined } from '@ant-design/icons';

export const columns: ColumnsType<InvoiceType> = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: '10%',
    },
    {
      title: 'Customer',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (value: string) => (
        <Tag color={getColorFromStatus(value)}>{value}</Tag>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      width: '20%',
      render: (value, record) => (
        <span className="total">{record.currency} {value / 100}</span>
      )
    },
    {
      title: 'Preview',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      width: '10%',
      render: (value) => (
        <div>
          <a href={'/invoice/' + value}>Preview</a>
          <LinkOutlined />
        </div>
      )
    }
  ];