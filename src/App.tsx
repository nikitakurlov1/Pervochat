import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import Auth from './components/Auth';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Layout from './components/Layout';
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

  // Якщо адмін - показуємо адмін-панель без навігації
  if (isAdmin()) {
    return (
      <Layout showNav={false}>
        <AdminPanel />
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'feed' && <Feed />}
      {activeTab === 'create' && <CreatePost onSuccess={() => setActiveTab('feed')} />}
      {activeTab === 'profile' && <Profile />}
    </Layout>
  );
}

export default App;
