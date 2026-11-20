import { Home, Flame } from 'lucide-react';

export default function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home',     label: 'Home',     Icon: Home  },
    { id: 'discover', label: 'Discover', Icon: Flame },
  ];

  return (
    <nav className="tab-bar" aria-label="Main navigation">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`tab-btn ${activeTab === id ? 'active' : ''}`}
          onClick={() => setActiveTab(id)}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          <Icon className="tab-icon" strokeWidth={activeTab === id ? 2.5 : 1.8} />
          {label}
        </button>
      ))}
    </nav>
  );
}
