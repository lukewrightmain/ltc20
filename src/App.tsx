// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import TokenView from './pages/TokenView';
import AddressView from './pages/AddressView';

const App = () => {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/token/:ticker" element={<TokenView />} /> {/* Define the route for TokenView */}
        <Route path="/address/:address" element={<AddressView />} /> {/* Define the route for TokenView */}
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
