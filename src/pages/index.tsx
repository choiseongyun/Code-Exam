import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExchanges, Exchange } from '../redux/exchanges';
import { RootState, AppDispatch } from '../redux/store';
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
  const exchanges = useSelector((state: RootState) => state.exchange.entities);
  const loading = useSelector((state: RootState) => state.exchange.loading);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [supportedPairs, setSupportedPairs] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExchanges());
  }, [dispatch]);

  const handleRowClick = async (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setPairModalVisible(true);
    const pairs = await fetchSupportedPairs(exchange.id);
    setSupportedPairs(pairs);
  };

  const handleModalClose = () => {
    setSelectedExchange(null);
    setPairModalVisible(false);
  };

  const fetchSupportedPairs = async (exchangeId: string) => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/exchanges/${exchangeId}`);
    return response.data.supported_pairs;
  };

  return (
    <div>
      <Button onClick={() => console.log('Sort ASC')}>Sort ASC</Button>
      <Button onClick={() => console.log('Sort DESC')}>Sort DESC</Button>
      <Table
        dataSource={exchanges}
        columns={columns}
        rowKey="id"
        loading={loading === 'pending'}
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
          {supportedPairs && supportedPairs.map((pair) => (
            <li key={pair}>{pair}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default Home;
