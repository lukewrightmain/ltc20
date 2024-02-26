import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';
import SearchBar from '../components/SearchBar';
import liteIcon from '../assets/lite.webp'; // Import the LITE icon


type TokenData = {
  ticker: string;
  supply: string;
  holders: number;
  iconUrl?: string; // Optional if you have icons for other tokens from the API
};

const MainPage = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const tickers = ['lite', 'labs']; // Add more tickers if needed
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          tickers.map(ticker =>
            axios.get(`https://api.chikun.market/api/ltc20/${ticker}`)
          )
        );
        const tokenData: TokenData[] = responses.map((response, index) => ({
          ticker: tickers[index],
          supply: response.data.result.supply,
          holders: response.data.result.holders,
          // Add the iconUrl only if it's available in the response
          iconUrl: response.data.result.iconUrl || (tickers[index] === 'lite' ? liteIcon : undefined),
        }));
        setTokens(tokenData);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <div className={styles.tableHeader}>
        <span>Token</span>
        <span>Supply</span>
        <span>Holders</span>
      </div>
      {tokens.map((token, index) => (
        <Link to={`/token/${token.ticker}`} key={token.ticker} className={styles.tokenRow}>
          <div className={styles.tokenIndex}>{index + 1}.</div>
          {/* Use the iconUrl if available, otherwise use a default/placeholder */}
          <div className={styles.tokenName}>{token.ticker.toUpperCase()}</div>
          <div className={styles.tokenSupply}>{token.supply}</div>
          <div className={styles.tokenHolders}>{token.holders}</div>
        </Link>
      ))}
    </div>
  );
};

export default MainPage;
