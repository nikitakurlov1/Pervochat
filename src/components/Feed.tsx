import { useEffect, useState } from 'react';
import { Search, Filter, TrendingUp, RefreshCw } from 'lucide-react';
import { postsAPI } from '../api/api';
import PostCard from './PostCard';
import CommentSheet from './CommentSheet';
import './Feed.css';

const categories = ['Усі', 'Оголошення', 'Питання', 'Мем', 'Новина', 'Допомога'];

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const fetchPosts = async (eventOrSilent?: React.MouseEvent | boolean) => {
    const silent = typeof eventOrSilent === 'boolean' ? eventOrSilent : false;
    if (!silent) setLoading(true);
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Автооновлення кожні 5 секунд (silent mode - без loader)
    const interval = setInterval(() => {
      fetchPosts(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...posts];

    // Фільтр по категорії
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Пошук
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортування
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.likes.length - a.likes.length);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const handleCommentAdded = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feed-header">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Пошук постів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="feed-filters">
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="feed-sort">
          <button
            className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
            onClick={() => setSortBy('recent')}
          >
            <Filter size={16} />
            Нові
          </button>
          <button
            className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
            onClick={() => setSortBy('popular')}
          >
            <TrendingUp size={16} />
            Популярні
          </button>
          <button onClick={fetchPosts} className="btn-refresh" title="Оновити">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="feed-content">
        {filteredPosts.length === 0 ? (
          <div className="empty">
            {searchQuery || selectedCategory 
              ? 'Нічого не знайдено. Спробуйте змінити фільтри.'
              : 'Поки немає постів. Створіть перший!'}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCommentClick={() => setSelectedPost(post)}
              onUpdate={fetchPosts}
            />
          ))
        )}
      </div>

      {selectedPost && (
        <CommentSheet
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
