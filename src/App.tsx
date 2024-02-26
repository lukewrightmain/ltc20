// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';

const App = () => {
  return (
    <Router basename="/ltc20"> {/* Set the basename here if necessary */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
