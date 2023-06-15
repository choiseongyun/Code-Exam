// src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Exchange, fetchExchanges, updateSortOrder } from '../redux/exchanges';
import { RootState, AppDispatch } from '../redux/store';
import styles from '../styles/table.module.css';
import axios from 'axios';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Year Established',
    dataIndex: 'year_established',
    key: 'year_established',
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'Volume',
    dataIndex: 'trade_volume_24h_btc',
    key: 'trade_volume_24h_btc',
  },
];

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sortedEntities = useSelector((state: RootState) => state.exchange.sortedEntities);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [supportedPairs, setSupportedPairs] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExchanges());
  }, [dispatch]);

  const handleSortOrder = (newSortOrder: 'asc' | 'desc') => {
    dispatch(updateSortOrder(newSortOrder));
  };

  const handleRowClick = async (exchange: Exchange) => {
    setSelectedExchange(exchange);
    const pairs = await fetchSupportedPairs(exchange.id);
    setSupportedPairs(pairs);
    setPairModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedExchange(null);
    setPairModalVisible(false);
  };

 const fetchSupportedPairs = async (exchangeId: string) => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/exchanges/${exchangeId}/list`);
  return response.data;
};

  return (
    <div className={styles.table}>
      <Button onClick={() => handleSortOrder('asc')}>Sort ASC</Button>
      <Button onClick={() => handleSortOrder('desc')}>Sort DESC</Button>
      <Table
        dataSource={sortedEntities}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        visible={pairModalVisible}
        title="Supported Pairs"
        onCancel={handleModalClose}
        footer={null}
      >
        <ul>
          {supportedPairs.map((pair) => (
            <li key={pair}>{pair}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default Home;
