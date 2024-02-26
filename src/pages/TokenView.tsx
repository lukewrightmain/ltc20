import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import styles from '../styles/TokenView.module.css'; // Import CSS for TokenView
import { useParams } from 'react-router-dom'; // Import useParams hook

type TokenData = {
  ticker: string;
  supply: string;
  holders: number;
  transactions: number;
};

type Holder = {
  id: number;
  address: string;
  balance: string;
};

const TokenView = () => {
  const { ticker = '' } = useParams<{ ticker?: string }>(); // Provide a default value for ticker
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [holders, setHolders] = useState<Holder[]>([]); // State to store holders data
  const [activeTab, setActiveTab] = useState<'holders' | 'transactions'>('holders');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const [tokenResponse, holdersResponse] = await Promise.all([
          axios.get(`https://api.chikun.market/api/ltc20/${ticker}`),
          axios.get(`https://api.chikun.market/api/ltc20/holders?ticker=${ticker}&page=${currentPage}`),
        ]);
        const { supply, transactions } = tokenResponse.data.result;
        const holdersData: Holder[] = holdersResponse.data.result.map((holder: any) => ({
          id: holder.id,
          address: holder.address,
          balance: holder.balance,
        }));
        setTokenData({ ticker, supply, holders: holdersData.length, transactions });
        setHolders(holdersData);
        // Set the total number of pages based on the response headers
        const totalPagesHeader = holdersResponse.headers['x-total-pages'];
        setTotalPages(parseInt(totalPagesHeader, 10) || 1);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, [ticker, currentPage]); // Fetch data whenever the ticker parameter or currentPage changes

  const handleTabChange = (tab: 'holders' | 'transactions') => {
    setActiveTab(tab);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (!tokenData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.tokenViewContainer}>
      <SearchBar />
      <div className={styles.tokenInfo}>
        <h1>{tokenData.ticker.toUpperCase()}</h1>
        <div>Supply: {tokenData.supply}</div>
      </div>
      <div className={styles.tabs}>
        <button
          className={activeTab === 'holders' ? styles.activeTab : ''}
          onClick={() => handleTabChange('holders')}
        >
          Holders
        </button>
        <button
          className={activeTab === 'transactions' ? styles.activeTab : ''}
          onClick={() => handleTabChange('transactions')}
        >
          Transactions
        </button>
      </div>
      <div className={styles.paginationButtons}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'holders' && (
          <div className={styles.holdersContainer}>
            {holders.map((holder) => (
              <a
                key={holder.id}
                href={`/ltc20/address/${holder.address}`}
                className={styles.holderItem}
              >
                <div className={styles.address}>{holder.address}</div>
                <div className={styles.balance}>Balance: {holder.balance}</div>
              </a>
            ))}
          </div>
        )}
        {activeTab === 'transactions' && (
          <div>
            {/* Display transactions data here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenView;
