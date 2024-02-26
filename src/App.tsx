// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import TokenView from './pages/TokenView'; // Import the TokenView component

const App = () => {
  return (
    <Router basename="/ltc20">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/token/:ticker" element={<TokenView />} /> {/* Define the route for TokenView */}
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
