import { useState } from 'react';
import './App.css';
import HomeTab from './pages/HomeTab.jsx';
import DiscoverTab from './pages/DiscoverTab.jsx';
import TabBar from './components/TabBar.jsx';

export default function App() {
  // Default to 'discover' so reviewers land on the action immediately
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="app-shell">
      <main className="page-area">
        {activeTab === 'home'     && <HomeTab setActiveTab={setActiveTab} />}
        {activeTab === 'discover' && <DiscoverTab />}
      </main>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
