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

  //useSelector 훅을 사용하여 Redux 스토어 상태를 선택합니다.
  const exchanges = useSelector((state: RootState) => state.exchange.entities);
  const loading = useSelector((state: RootState) => state.exchange.loading);

  // 선택된 거래소와 관련된 상태를 관리하기 위해 useState 훅을 사용합니다.
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [supportedPairs, setSupportedPairs] = useState<string[] | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 정렬 방식 상태 변수 추가

  // useEffect 훅을 사용하여 컴포넌트가 마운트되었을 시 fetchExchanges 액션을 디스패치합니다.
  useEffect(() => {
    dispatch(fetchExchanges());
  }, [dispatch]);

  // 테이블 행 클릭 시 호출되는 이벤트 핸들러 함수입니다.
  /**
   * @author 최성윤
   * @param exchange 
   */
  const handleRowClick = async (exchange: Exchange) => {
    console.log('Clicked Row:', exchange);
    setSelectedExchange(exchange);
    setPairModalVisible(true);
    try {
      const pairs = await fetchSupportedPairs(exchange.id) as string[];
      setSupportedPairs(pairs);
    } catch (error) {
      console.error('Failed to fetch supported pairs:', error);
      setSupportedPairs([]);
    }
  };
  /**
   * @author 최성윤
   * 모달을 닫고 선택된 거래소와 관련된 상태를 초기화하는 함수입니다.
   */
  const handleModalClose = () => {
    setSelectedExchange(null);
    setPairModalVisible(false);
  };
  
  /**
   * @author 최성윤
   * 오름차순으로 정렬을 처리하는 이벤트 핸들러 함수입니다.
   */
  const handleSortAsc = () => {
    setSortOrder('asc');
  };
  
  /**
   * @author 최성윤
   * 내림차순으로 정렬을 처리하는 이벤트 핸들러 함수입니다.
   */
  const handleSortDesc = () => {
    setSortOrder('desc');
  };
  
  /**
   * 거래소를 정렬된 상태로 반환하는 함수입니다.
   * @author 최성윤
   * @param a 첫 번째 거래소
   * @param b 두 번째 거래소
   * @returns 정렬된 거래소 배열
   */
  const sortedExchanges = [...exchanges].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.trade_volume_24h_btc - b.trade_volume_24h_btc;
    } else {
      return b.trade_volume_24h_btc - a.trade_volume_24h_btc;
    }
  });
  /**
   * 지원되는 페어를 가져오는 비동기 함수입니다.
   * @author 최성윤
   * @param exchangeId 거래소 ID
   * @returns 페어 배열
   */
  const fetchSupportedPairs = async (exchangeId: string) => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/exchanges/${exchangeId}/tickers`);
    const uniquePairs = [...new Set(response.data.tickers.map((ticker: any) => ticker.target))];
    return uniquePairs;
  };
  
  return (
    <div className="bg-white h-screen">
      <Button onClick={handleSortAsc}>Sort ASC</Button>
      <Button onClick={handleSortDesc}>Sort DESC</Button>
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
        open={pairModalVisible}
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
