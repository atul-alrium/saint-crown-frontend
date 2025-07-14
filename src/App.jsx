import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletPage from './components/WalletPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from './components/LoginPage';
import './css/styles.css';
import './config';
import LoginPageNew from './components/NewLogin';
import { WalletProvider } from './components/walletContext';

function App() {
  return (
   <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/LoginPageNew" element={<LoginPageNew />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
