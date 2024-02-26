import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';

type TokenData = {
  ticker: string;
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
      {tokens.map((token, index) => (
        <div key={token.ticker} className={styles.tokenCard}>
          <div className={styles.tokenIndex}>{index + 1}.</div>
          <Link to={`/token/${token.ticker}`}>
            <div className={styles.tokenTicker}>{token.ticker.toUpperCase()}</div>
            <div className={styles.tokenHolders}>{token.holders} Holders</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainPage;
