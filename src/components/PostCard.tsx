import { useState } from 'react';
import { Heart, MessageCircle, Trash2, Paperclip, Download, ExternalLink } from 'lucide-react';
import { likesAPI, postsAPI } from '../api/api';
import { useAuthStore } from '../store/authStore';
import ImageGallery from './ImageGallery';
import './PostCard.css';

interface PostCardProps {
  post: any;
  onCommentClick: () => void;
  onUpdate: () => void;
}

export default function PostCard({ post, onCommentClick, onUpdate }: PostCardProps) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like: any) => like.userId === user?.id)
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    try {
      const response = await likesAPI.toggle(post.id);
      setIsLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Видалити пост?')) {
      try {
        await postsAPI.delete(post.id);
        onUpdate();
      } catch (error) {
        console.error('Failed to delete post', error);
      }
    }
  };

  const handleVote = async (optionId: number) => {
    try {
      await postsAPI.vote(optionId);
      onUpdate();
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author-info">
          <div className="post-author-avatar">
            {post.user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="post-author">{post.user.username}</div>
            <div className="post-category">{post.category}</div>
          </div>
        </div>
        {post.userId === user?.id && (
          <button onClick={handleDelete} className="btn-delete">
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <p className="post-text">{post.text}</p>
      
      {post.imageUrls && (() => {
        try {
          const images = JSON.parse(post.imageUrls);
          return <ImageGallery images={images} />;
        } catch {
          return null;
        }
      })()}

      {post.fileUrl && (
        <a href={post.fileUrl} download className="post-file">
          <Paperclip size={18} />
          <span>{post.fileName || 'Завантажити файл'}</span>
          <Download size={16} />
        </a>
      )}

      {post.youtubeUrl && (() => {
        const videoId = post.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
        return videoId ? (
          <div className="post-youtube">
            <iframe
              width="100%"
              height="250"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : null;
      })()}

      {post.linkPreview && (
        <a href={post.linkPreview} target="_blank" rel="noopener noreferrer" className="post-link">
          <ExternalLink size={16} />
          <span>{post.linkPreview}</span>
        </a>
      )}

      {post.poll && (
        <div className="poll">
          <p className="poll-question">{post.poll.question}</p>
          <div className="poll-options">
            {post.poll.options.map((option: any) => {
              const totalVotes = post.poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  className="poll-option"
                >
                  <div className="poll-option-bar" style={{ width: `${percentage}%` }}></div>
                  <div className="poll-option-content">
                    <span className="poll-option-text">{option.text}</span>
                    <span className="poll-option-votes">{percentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="post-actions">
        <button onClick={handleLike} className={`btn-action ${isLiked ? 'liked' : ''}`}>
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>
        <button onClick={onCommentClick} className="btn-action">
          <MessageCircle size={20} />
          <span>{post.comments.length}</span>
        </button>
      </div>
    </div>
  );
}
