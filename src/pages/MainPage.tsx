import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';

type TokenData = {
  ticker: string;
  supply: string;
  holders: number;
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
      <div className={styles.tableHeader}>
        <span>Token</span>
        <span>Supply</span>
        <span>Holders</span>
      </div>
      {tokens.map((token, index) => (
        <Link to={`/token/${token.ticker}`} key={token.ticker} className={styles.tokenRow}>
          <div className={styles.tokenIndex}>{index + 1}.</div>
          <div className={styles.tokenIcon}>
            {/* Placeholder for icon */}
          </div>
          <div className={styles.tokenName}>{token.ticker.toUpperCase()}</div>
          <div className={styles.tokenSupply}>{token.supply}</div>
          <div className={styles.tokenHolders}>{token.holders} Holders</div>
        </Link>
      ))}
    </div>
  );
};

export default MainPage;
