import { useEffect, useState } from 'react';
import { Shield, MessageCircle, Send, X } from 'lucide-react';
import { trustBoxAPI } from '../api/api';
import './TrustBoxAdmin.css';

export default function TrustBoxAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async (silent = false) => {
    try {
      const response = await trustBoxAPI.getAll();
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Автооновлення кожні 3 секунди (silent mode)
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleReply = async (messageId: number) => {
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      await trustBoxAPI.reply(messageId, replyText);
      setReplyText('');
      setReplyingTo(null);
      fetchMessages();
    } catch (error) {
      console.error('Failed to send reply', error);
    } finally {
      setSending(false);
    }
  };

  const unansweredCount = messages.filter(m => !m.isAnswered).length;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="trustbox-admin">
      <div className="trustbox-admin-header">
        <div className="header-title">
          <Shield size={24} />
          <div>
            <h2>Скарбничка довіри</h2>
            <p className="header-subtitle">
              {unansweredCount > 0 
                ? `${unansweredCount} повідомлень очікують відповіді`
                : 'Всі повідомлення оброблені'}
            </p>
          </div>
        </div>
      </div>

      <div className="messages-admin-list">
        {messages.length === 0 ? (
          <div className="empty-admin">
            <MessageCircle size={48} />
            <p>Поки немає повідомлень</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-admin-card ${msg.isAnswered ? 'answered' : 'pending'}`}>
              <div className="message-admin-header">
                <div className="anonymous-badge">
                  <Shield size={16} />
                  Анонімний учень
                </div>
                <div className="message-date">
                  {new Date(msg.createdAt).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="message-admin-content">
                <p>{msg.content}</p>
              </div>

              {msg.isAnswered && msg.reply ? (
                <div className="reply-section answered-reply">
                  <div className="reply-label">
                    <Shield size={14} />
                    Ваша відповідь
                  </div>
                  <p>{msg.reply}</p>
                  <div className="reply-date">
                    {new Date(msg.repliedAt).toLocaleDateString('uk-UA', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ) : replyingTo === msg.id ? (
                <div className="reply-section reply-form">
                  <textarea
                    placeholder="Напишіть відповідь..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="reply-actions">
                    <button 
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }} 
                      className="btn-cancel-reply"
                    >
                      <X size={16} />
                      Скасувати
                    </button>
                    <button 
                      onClick={() => handleReply(msg.id)} 
                      disabled={sending}
                      className="btn-send-reply"
                    >
                      <Send size={16} />
                      {sending ? 'Відправка...' : 'Відправити'}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setReplyingTo(msg.id)} 
                  className="btn-reply"
                >
                  <MessageCircle size={16} />
                  Відповісти
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
