import { Home, PlusSquare, User } from 'lucide-react';
import './BottomNav.css';

interface BottomNavProps {
  activeTab: 'feed' | 'create' | 'profile';
  onTabChange: (tab: 'feed' | 'create' | 'profile') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        className={activeTab === 'feed' ? 'active' : ''}
        onClick={() => onTabChange('feed')}
      >
        <Home size={24} className="nav-icon" strokeWidth={activeTab === 'feed' ? 2.5 : 2} />
        <span className="label">Стрічка</span>
      </button>
      <button
        className={activeTab === 'create' ? 'active' : ''}
        onClick={() => onTabChange('create')}
      >
        <PlusSquare size={24} className="nav-icon" strokeWidth={activeTab === 'create' ? 2.5 : 2} />
        <span className="label">Створити</span>
      </button>
      <button
        className={activeTab === 'profile' ? 'active' : ''}
        onClick={() => onTabChange('profile')}
      >
        <User size={24} className="nav-icon" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        <span className="label">Профіль</span>
      </button>
    </nav>
  );
}
