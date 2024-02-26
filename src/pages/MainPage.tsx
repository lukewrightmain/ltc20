import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';
import liteIcon from '../assets/lite.webp'; // Import the LITE icon
import SearchBar from '../components/SearchBar';

type TokenData = {
  ticker: string;
  supply: string;
  holders: number;
  iconUrl?: string; // Optional if you have icons for other tokens from the API
};

const MainPage = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tokensPerPage = 24;

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.chikun.market/api/ltc20?page=${currentPage}`);
        const tokenData: TokenData[] = response.data.result.map((token: any) => ({
          ticker: token.ticker,
          supply: token.supply,
          holders: token.holders,
          // Add the iconUrl only if it's available in the response
          iconUrl: token.iconUrl || (token.ticker === 'lite' ? liteIcon : undefined),
        }));
        setTokens(tokenData);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <div className={styles.paginationButtons}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
        <button onClick={handleNextPage}>Next Page</button>
      </div>
      <div className={styles.tableHeader}>
        <span>Token</span>
        <span>Supply</span>
        <span>Holders</span>
      </div>
      {tokens.map((token, index) => (
        <Link to={`/token/${token.ticker}`} key={token.ticker} className={styles.tokenRow}>
          <div className={styles.tokenIndex}>{(currentPage - 1) * tokensPerPage + index + 1}.</div>
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
