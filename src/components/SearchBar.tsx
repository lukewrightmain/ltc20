import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SearchBar.module.css';

const SearchBar: React.FC = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const path = input.length === 4 ? `/token/${input}` : `/address/${input}`;
    navigate(path);
  };

  return (
    <div className={styles.searchContainer}>
      <a href="https://litecoinlabs.xyz" className={styles.logo}>
        LLABS
      </a>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter token ticker or address"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
      <button className={styles.rightButton}>
      </button>
    </div>
  );
};

export default SearchBar;
