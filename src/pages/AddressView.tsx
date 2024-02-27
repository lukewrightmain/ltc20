import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import styles from '../styles/AddressView.module.css';
import { useParams, useNavigate } from 'react-router-dom';

type CollectionItem = {
  ticker: string;
  totalBalance: string;
  transferableBalance: string;
  availableBalance: string;
  transferInscriptions: []; // Adjust according to the actual data structure
};

type CollectionsState = {
  ltc20: CollectionItem[];
};

const AddressView = () => {
  const { address = '' } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [collectionsState, setCollectionsState] = useState<CollectionsState>({ ltc20: [] });
  const [activeTab, setActiveTab] = useState<'tokens' | 'transactions'>('tokens');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`https://api.chikun.market/api/address/collections?address=${address}&page=${currentPage}`);
        const ltc20Data = response.data.result.ltc20.map((item) => {
          // Convert balance strings to numbers and sum them to get total balance
          const transferable = parseFloat(item.transferableBalance);
          const available = parseFloat(item.availableBalance);
          const totalBalance = transferable + available;
          return {
            ...item,
            // Convert total balance back to string if needed or keep it as number depending on your formatting requirements
            totalBalance: totalBalance.toString(),
          };
        });
        setCollectionsState({ ltc20: ltc20Data });
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    if (address) {
      fetchCollections();
    }
  }, [address]);

  const fetchTransactions = async (ticker: string, page: number) => {
    try {
      const response = await axios.get(`https://api.chikun.market/api/ltc20/history?address=${address}&ticker=${ticker}&page=${page}`);
      let transactionData = response.data.result;
      
      // Sort transactions by timestamp in descending order
      transactionData.sort((a, b) => b.timestamp - a.timestamp);
    
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions' && selectedTicker) {
      fetchTransactions(selectedTicker, currentPage); // Now fetches transactions for the selected ticker
    } else {
      setTransactions([]);
    }
  }, [activeTab, currentPage, selectedTicker]);

  const navigateToHome = () => {
    navigate('/');
  };

  const handleTabChange = (tab: 'tokens' | 'transactions', ticker: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset current page to 1 when switching tabs
    if (tab === 'transactions') {
      setSelectedTicker(ticker);
      fetchTransactions(ticker, 1); // Fetch transactions for the first page when switching to transactions tab
    } else {
      // Reset transactions state when switching to tokens tab
      setTransactions([]);
    }
  };
  
  const handleNextPage = (ticker: string) => {
    if (activeTab === 'tokens') {
      setCurrentPage(prevPage => prevPage + 1);
      // Fetch tokens for the next page if necessary
    } else if (activeTab === 'transactions') {
      setSelectedTicker(ticker);
      setCurrentPage(prevPage => prevPage + 1);
      fetchTransactions(ticker, currentPage + 1); // Fetch transactions for the next page by passing currentPage + 1
    }
  };

  const handlePrevPage = (ticker: string) => {
    if (currentPage > 1) {
      setSelectedTicker(ticker);
      setCurrentPage(prevPage => prevPage - 1);
      fetchTransactions(ticker, currentPage - 1); // Fetch transactions for the previous page
    }
  };

  const handleTokenClick = (ticker: string) => {
    setSelectedTicker(ticker); // Store the selected ticker
    setActiveTab('transactions'); // Switch to the transactions tab
    fetchTransactions(ticker, 1); // Fetch transactions for the selected ticker
  };

  return (
    <div className={styles.addressViewContainer}>
      <SearchBar />
      <button onClick={navigateToHome} className={styles.backButton}>Back to Home</button>
      <h2>{address}</h2>
      {activeTab === 'transactions' && (
      <div className={styles.tabs}>
        <h2>{selectedTicker.toUpperCase()} Transactions</h2>
        <button
          className={activeTab === 'transactions' ? styles.activeTab : ''}
          onClick={() => handleTabChange('tokens')}
        >
          Back
        </button>
      </div>
      )}
      <div className={styles.paginationButtons}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
        <button onClick={handleNextPage}>Next Page</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'tokens' && (
          <>
            <div className={styles.tokenRowHeader}>
              <div className={styles.columnHeader}>TICK</div>
              <div className={styles.columnHeader}>TOTAL BALANCE</div>
              <div className={styles.columnHeader}>AVAILABLE</div>
              <div className={styles.columnHeader}>TRANSFERABLE</div>
            </div>
            <div>
              {collectionsState.ltc20.map((item, index) => (
              <div key={index} className={styles.tokenRow} onClick={() => handleTokenClick(item.ticker)}>
                  <div className={styles.dataCell}>{item.ticker.toUpperCase()}</div>
                  <div className={styles.dataCell}>{item.totalBalance}</div>
                  <div className={styles.dataCell}>{item.availableBalance}</div>
                  <div className={styles.dataCell}>{item.transferableBalance}</div>
                </div>
              ))}
            </div>
          </>
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

export default AddressView;
