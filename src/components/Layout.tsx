import { ReactNode } from 'react';
import { Home, PlusSquare, User, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
  activeTab?: 'feed' | 'create' | 'profile';
  onTabChange?: (tab: 'feed' | 'create' | 'profile') => void;
  showNav?: boolean;
}

export default function Layout({ children, activeTab, onTabChange, showNav = true }: LayoutProps) {
  const { user } = useAuthStore();

  return (
    <div className="layout">
      {/* Desktop Header - показується тільки на ПК */}
      {showNav && (
        <header className="desktop-header">
          <div className="header-content">
            <div className="header-logo">
              <Shield size={28} />
              <span>SchoolV</span>
            </div>
            <nav className="desktop-nav">
              <button
                className={activeTab === 'feed' ? 'active' : ''}
                onClick={() => onTabChange?.('feed')}
              >
                <Home size={20} />
                <span>Стрічка</span>
              </button>
              <button
                className={activeTab === 'create' ? 'active' : ''}
                onClick={() => onTabChange?.('create')}
              >
                <PlusSquare size={20} />
                <span>Створити</span>
              </button>
              <button
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => onTabChange?.('profile')}
              >
                <User size={20} />
                <span>Профіль</span>
              </button>
            </nav>
            <div className="header-user">
              <div className="user-avatar">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user?.username}</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="layout-main">
        <div className="layout-container">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - показується тільки на мобільних */}
      {showNav && (
        <nav className="mobile-bottom-nav">
          <button
            className={activeTab === 'feed' ? 'active' : ''}
            onClick={() => onTabChange?.('feed')}
          >
            <Home size={24} strokeWidth={activeTab === 'feed' ? 2.5 : 2} />
            <span>Стрічка</span>
          </button>
          <button
            className={activeTab === 'create' ? 'active' : ''}
            onClick={() => onTabChange?.('create')}
          >
            <PlusSquare size={24} strokeWidth={activeTab === 'create' ? 2.5 : 2} />
            <span>Створити</span>
          </button>
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => onTabChange?.('profile')}
          >
            <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span>Профіль</span>
          </button>
        </nav>
      )}
    </div>
  );
}
