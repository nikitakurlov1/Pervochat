import { useState, useRef } from 'react';
import { Image, BarChart3, X, Plus, Paperclip, Youtube, Link as LinkIcon } from 'lucide-react';
import { postsAPI } from '../api/api';
import './CreatePost.css';

interface CreatePostProps {
  onSuccess: () => void;
}

const categories = ['Оголошення', 'Питання', 'Мем', 'Новина', 'Допомога'];

export default function CreatePost({ onSuccess }: CreatePostProps) {
  const [category, setCategory] = useState('Оголошення');
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkPreview, setLinkPreview] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isPoll, setIsPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Максимум 10 фото
    const newImages = [...images, ...files].slice(0, 10);
    setImages(newImages);

    // Створюємо превью для нових фото
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews].slice(0, 10));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('text', text);
    
    // Додаємо всі фото
    images.forEach((image) => {
      formData.append('images', image);
    });
    
    if (file) formData.append('file', file);
    if (youtubeUrl) formData.append('youtubeUrl', youtubeUrl);
    if (linkPreview) formData.append('linkPreview', linkPreview);
    if (isPoll) {
      formData.append('pollQuestion', pollQuestion);
      formData.append('pollOptions', JSON.stringify(pollOptions.filter(o => o.trim())));
    }

    try {
      await postsAPI.create(formData);
      setText('');
      setImages([]);
      setImagePreviews([]);
      setFile(null);
      setYoutubeUrl('');
      setLinkPreview('');
      setShowYoutubeInput(false);
      setShowLinkInput(false);
      setIsPoll(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setCategory('Оголошення');
      onSuccess();
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  return (
    <div className="create-post">
      <div className="create-header">
        <h2>Створити пост</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <textarea
          className="post-textarea"
          placeholder="Що нового?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        {imagePreviews.length > 0 && (
          <div className="images-preview-grid">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="image-preview-item">
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button type="button" onClick={() => removeImage(index)} className="btn-remove-image">
                  <X size={16} />
                </button>
                {index === 0 && imagePreviews.length > 1 && (
                  <div className="image-badge">1/{imagePreviews.length}</div>
                )}
              </div>
            ))}
            {imagePreviews.length < 10 && (
              <label htmlFor="image-input-more" className="add-more-images">
                <Plus size={24} />
                <span>Додати ще</span>
              </label>
            )}
          </div>
        )}

        {file && (
          <div className="file-preview">
            <Paperclip size={16} />
            <span>{file.name}</span>
            <button type="button" onClick={() => setFile(null)} className="btn-remove-file">
              <X size={16} />
            </button>
          </div>
        )}

        {showYoutubeInput && (
          <div className="youtube-input-container">
            <input
              type="text"
              placeholder="Вставте посилання на YouTube відео"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="youtube-input"
            />
            {youtubeUrl && extractYoutubeId(youtubeUrl) && (
              <div className="youtube-preview">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${extractYoutubeId(youtubeUrl)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <button type="button" onClick={() => { setYoutubeUrl(''); setShowYoutubeInput(false); }} className="btn-remove-youtube">
              <X size={16} /> Видалити відео
            </button>
          </div>
        )}

        {showLinkInput && (
          <div className="link-input-container">
            <input
              type="text"
              placeholder="Вставте посилання для попереднього перегляду"
              value={linkPreview}
              onChange={(e) => setLinkPreview(e.target.value)}
              className="link-input"
            />
            {linkPreview && (
              <div className="link-preview-box">
                <LinkIcon size={16} />
                <span>{linkPreview}</span>
              </div>
            )}
            <button type="button" onClick={() => { setLinkPreview(''); setShowLinkInput(false); }} className="btn-remove-link">
              <X size={16} /> Видалити посилання
            </button>
          </div>
        )}

        {isPoll && (
          <div className="poll-form">
            <input
              type="text"
              className="poll-question-input"
              placeholder="Питання опитування"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              required
            />
            <div className="poll-options-list">
              {pollOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  className="poll-option-input"
                  placeholder={`Варіант ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...pollOptions];
                    newOptions[index] = e.target.value;
                    setPollOptions(newOptions);
                  }}
                />
              ))}
            </div>
            <button type="button" onClick={addPollOption} className="btn-add-option">
              <Plus size={16} />
              Додати варіант
            </button>
          </div>
        )}

        <div className="form-actions">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-input"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-input-more"
          />
          <label htmlFor="image-input" className="btn-action-icon">
            <Image size={18} />
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" className="btn-action-icon" title="Прикріпити файл">
            <Paperclip size={18} />
          </label>
          
          <button 
            type="button" 
            onClick={() => setShowYoutubeInput(!showYoutubeInput)} 
            className={`btn-action-icon ${showYoutubeInput ? 'active' : ''}`}
            title="YouTube відео"
          >
            <Youtube size={18} />
          </button>

          <button 
            type="button" 
            onClick={() => setShowLinkInput(!showLinkInput)} 
            className={`btn-action-icon ${showLinkInput ? 'active' : ''}`}
            title="Посилання"
          >
            <LinkIcon size={18} />
          </button>
          
          <button 
            type="button" 
            onClick={() => setIsPoll(!isPoll)} 
            className={`btn-action-icon ${isPoll ? 'active' : ''}`}
            title="Опитування"
          >
            <BarChart3 size={18} />
          </button>
        </div>

        <button type="submit" className="btn-submit">Опублікувати</button>
      </form>
    </div>
  );
}
