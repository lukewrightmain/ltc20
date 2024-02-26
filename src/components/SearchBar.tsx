import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SearchBar.module.css';

const SearchBar: React.FC = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If the input length is exactly 4, navigate to the token view.
    // Otherwise, assume it's an address and navigate to the address view.
    const path = input.length === 4 ? `/token/${input}` : `/address/${input}`;
    navigate(path);
  };
  
  return (
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
  );
};

export default SearchBar;