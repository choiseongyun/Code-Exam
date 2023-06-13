import React, { useEffect } from 'react';
import { Table , Button} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExchanges, updateSortOrder } from '../redux/exchanges';
import { RootState, AppDispatch } from '../redux/store';
import styles from '../styles/table.module.css'; // 스타일 파일 import
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

  useEffect(() => {
    dispatch(fetchExchanges());
  }, [dispatch]);

  const handleSortOrder = (newSortOrder: 'asc' | 'desc') => {
    dispatch(updateSortOrder(newSortOrder));
  };

  return (
    <div className={styles.table}>
      <Button onClick={() => handleSortOrder('asc')}>Sort ASC</Button>
      <Button onClick={() => handleSortOrder('desc')}>Sort DESC</Button>
      <Table dataSource={sortedEntities} columns={columns} rowKey="id" />
    </div>
  );
};

export default Home;
