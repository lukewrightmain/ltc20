import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import styles from '../styles/TokenView.module.css';
import { useParams, useNavigate, Link } from 'react-router-dom';

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

type Transaction = {
  id: number;
  address_sender: string;
  address_receiver: string;
  amount: string;
  ticker: string;
  action: string;
  invalid: boolean;
  tx_id: string;
  inscription_id: string;
  inscription_num: number;
  height: number;
  timestamp: number;
};

const TokenView: React.FC = () => {
  const { ticker = '' } = useParams<{ ticker?: string }>();
  const navigate = useNavigate(); // Initialize useNavigate
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [holders, setHolders] = useState<Holder[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'holders' | 'transactions'>('holders');
  const [currentPage, setCurrentPage] = useState<number>(1);

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
            balance: (parseFloat(holder.balance) + parseFloat(holder.transfer_balance)).toString(),
          }));
          setTokenData({ ticker, supply, holders: holdersData.length, transactions });
          setHolders(holdersData);
        } catch (error) {
          console.error('Error fetching token data:', error);
        }
      };

    fetchTokenData();
  }, [ticker, currentPage]);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions(currentPage); // Fetch transactions for the current page when the transactions tab is active
    } else {
      // Reset transactions state when switching to holders tab
      setTransactions([]);
    }
  }, [activeTab, currentPage]);

  const fetchTransactions = async (page: number) => {
    try {
      const response = await axios.get(`https://api.chikun.market/api/ltc20/transactions?ticker=${ticker}&page=${page}`);
      let transactionData: Transaction[] = response.data.result;
      
      // Sort transactions by timestamp in descending order
      transactionData.sort((a, b) => b.timestamp - a.timestamp);
    
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  const handleTabChange = (tab: 'holders' | 'transactions') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset current page to 1 when switching tabs
    if (tab === 'transactions') {
      fetchTransactions(1); // Fetch transactions for the first page when switching to transactions tab
    } else {
      // Reset transactions state when switching to holders tab
      setTransactions([]);
    }
  };
  

  const handleNextPage = () => {
    if (activeTab === 'holders') {
      setCurrentPage(prevPage => prevPage + 1);
      // Fetch holders for the next page if necessary
    } else if (activeTab === 'transactions') {
      setCurrentPage(prevPage => prevPage + 1);
      fetchTransactions(currentPage + 1); // Fetch transactions for the next page by passing currentPage + 1
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      fetchTransactions(currentPage - 1); // Fetch transactions for the previous page
    }
  };

  const navigateToHome = () => {
    navigate('/'); // Adjust the path as necessary for your home page
  };
  
  if (!tokenData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.tokenViewContainer}>
      <SearchBar />
      <div className={styles.tokenInfo}>
        <button onClick={navigateToHome} className={styles.backButton}>Back to Home</button> {/* Add this line */}
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
        <button onClick={handleNextPage}>Next Page</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'holders' && (
          <div className={styles.holdersContainer}>
            {holders.map((holder) => (
              <Link
                key={holder.id}
                to={`/address/${holder.address}`}
                className={styles.holderItem}
              >
                <div className={styles.address}>{holder.address}</div>
                <div className={styles.balance}>Balance: {holder.balance}</div>
              </Link>
            ))}
          </div>
        )}
        {activeTab === 'transactions' && (
          <div className={styles.transactionsContainer}>
            {transactions.map((transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div>
                  <div>Sender: {transaction.address_sender}</div>
                  <div>Receiver: {transaction.address_receiver}</div>
                </div>
                <div>
                  <div>Amount: {transaction.amount}</div>
                  <div>Ticker: {transaction.ticker}</div>
                </div>
                <div>
                  <div>Action: {transaction.action}</div>
                  <div>Valid: {transaction.invalid ? 'False' : 'True'}</div> {/* Updated rendering */}
                </div>
                <div>
                  <div>
                    TX ID: <a href={`https://litecoinspace.org/tx/${transaction.tx_id}`}>View</a>
                  </div>
                  <div>
                    Inscription ID: <a href={`https://ordinalslite.com/inscription/${transaction.inscription_id}`}>View</a>
                  </div>
                  <div>
                    Inscription Number: <a href={`https://ordinalslite.com/inscription/${transaction.inscription_num}`}>View</a>
                  </div>
                  <div>
                    Height: <a href={`https://litecoinspace.org/block/${transaction.height}`}>View</a>
                  </div>
                  <div>Timestamp: {new Date(transaction.timestamp * 1000).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenView;
