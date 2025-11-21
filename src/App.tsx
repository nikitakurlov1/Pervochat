import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import Auth from './components/Auth';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  const { token, checkAuth, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'profile'>('feed');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!token) {
    return <Auth />;
  }

  // Если админ - показываем админ-панель
  if (isAdmin()) {
    return <AdminPanel />;
  }

  return (
    <div className="app">
      <div className="content">
        {activeTab === 'feed' && <Feed />}
        {activeTab === 'create' && <CreatePost onSuccess={() => setActiveTab('feed')} />}
        {activeTab === 'profile' && <Profile />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
