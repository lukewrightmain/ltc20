import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import styles from '../styles/AddressView.module.css'; // Ensure your CSS module is properly defined
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams hook

// Updated type to include new fields based on the API response
type TokenSummary = {
  overallBalance: string;
  transferableBalance: string;
  availableBalance: string;
  ticker: string; // Added ticker to replace Tick
};

const AddressView = () => {
  const { address = '' } = useParams<{ address?: string }>(); // Extract address from URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [tokenSummary, setTokenSummary] = useState<TokenSummary | null>(null);

  useEffect(() => {
    const fetchTokenSummary = async () => {
      try {
        const response = await axios.get(`https://api.chikun.market/api/ltc20/token-summary?address=${address}&ticker=lite`);
        const data = response.data.result.tokenBalance;
        setTokenSummary({
          overallBalance: data.overallBalance,
          transferableBalance: data.transferableBalance,
          availableBalance: data.availableBalance,
          ticker: data.ticker, // Convert ticker to uppercase
        });
      } catch (error) {
        console.error('Error fetching token summary:', error);
      }
    };

    if (address) {
      fetchTokenSummary();
    }
  }, [address]); // Re-fetch when the address changes

  const navigateToHome = () => {
    navigate('/'); // Adjust the path as necessary for your home page
  };

  if (!tokenSummary) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.addressViewContainer}>
      <SearchBar />
      <button onClick={navigateToHome} className={styles.backButton}>Back to Home</button> {/* Add this line */}
      <h2>{address}</h2>
      <div className={styles.tokenRowHeader}>
        <div className={styles.columnHeader}>TICK</div>
        <div className={styles.columnHeader}>TOTAL BALANCE</div>
        <div className={styles.columnHeader}>AVAILABLE</div>
        <div className={styles.columnHeader}>TRANSFERABLE</div>
      </div>
      <Link to={`/token/${tokenSummary.ticker}`} key={tokenSummary.ticker} className={styles.tokenRow}>
        <div className={styles.dataCell}>{tokenSummary.ticker.toUpperCase() || 'N/A'}</div>
        <div className={styles.dataCell}>{tokenSummary.overallBalance}</div>
        <div className={styles.dataCell}>{tokenSummary.availableBalance}</div>
        <div className={styles.dataCell}>{tokenSummary.transferableBalance}</div>
      </Link>
    </div>
  );
};

export default AddressView;
