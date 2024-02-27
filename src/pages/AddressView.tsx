import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import styles from '../styles/AddressView.module.css';
import { useParams, useNavigate } from 'react-router-dom';

type CollectionItem = {
  ticker: string;
  transferableBalance: string;
  availableBalance: string;
  transferInscriptions: any[]; // Adjust according to the actual data structure
};

type CollectionsState = {
  ltc20: CollectionItem[];
};

const AddressView = () => {
  const { address = '' } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const [collectionsState, setCollectionsState] = useState<CollectionsState>({ ltc20: [] });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`https://api.chikun.market/api/address/collections?address=${address}`);
        const { ltc20 } = response.data.result;
        setCollectionsState({ ltc20 });
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    if (address) {
      fetchCollections();
    }
  }, [address]);

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.addressViewContainer}>
      <SearchBar />
      <button onClick={navigateToHome} className={styles.backButton}>Back to Home</button>
      <h2>{address}</h2>
      <div className={styles.tokenRowHeader}>
        <div className={styles.columnHeader}>TICK</div>
        <div className={styles.columnHeader}>TOTAL BALANCE</div>
        <div className={styles.columnHeader}>AVAILABLE</div>
        <div className={styles.columnHeader}>TRANSFERABLE</div>
      </div>
      <div>
        {collectionsState.ltc20.map((item, index) => (
          <div key={index} className={styles.tokenRow}>
            <div className={styles.dataCell}>{item.ticker.toUpperCase()}</div>
            <div className={styles.dataCell}>{item.availableBalance}</div>
            <div className={styles.dataCell}>{item.transferableBalance}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressView;
