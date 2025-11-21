import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  if (images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderGallery = () => {
    if (images.length === 1) {
      return (
        <div className="gallery-single" onClick={() => setShowFullscreen(true)}>
          <img src={images[0]} alt="Post" />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="gallery-two">
          {images.map((img, idx) => (
            <div key={idx} className="gallery-item" onClick={() => { setCurrentIndex(idx); setShowFullscreen(true); }}>
              <img src={img} alt={`Photo ${idx + 1}`} />
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="gallery-three">
          <div className="gallery-item large" onClick={() => { setCurrentIndex(0); setShowFullscreen(true); }}>
            <img src={images[0]} alt="Photo 1" />
          </div>
          <div className="gallery-column">
            {images.slice(1).map((img, idx) => (
              <div key={idx + 1} className="gallery-item" onClick={() => { setCurrentIndex(idx + 1); setShowFullscreen(true); }}>
                <img src={img} alt={`Photo ${idx + 2}`} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4+ фото - сітка 2x2 з кнопкою "ще"
    return (
      <div className="gallery-grid">
        {images.slice(0, 4).map((img, idx) => (
          <div 
            key={idx} 
            className="gallery-item" 
            onClick={() => { setCurrentIndex(idx); setShowFullscreen(true); }}
          >
            <img src={img} alt={`Photo ${idx + 1}`} />
            {idx === 3 && images.length > 4 && (
              <div className="gallery-more">+{images.length - 4}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="image-gallery">
        {renderGallery()}
      </div>

      {showFullscreen && (
        <div className="gallery-fullscreen" onClick={() => setShowFullscreen(false)}>
          <button className="btn-close-gallery" onClick={() => setShowFullscreen(false)}>
            <X size={24} />
          </button>
          
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[currentIndex]} alt={`Photo ${currentIndex + 1}`} />
            
            {images.length > 1 && (
              <>
                <button className="btn-prev" onClick={prevImage}>
                  <ChevronLeft size={32} />
                </button>
                <button className="btn-next" onClick={nextImage}>
                  <ChevronRight size={32} />
                </button>
                <div className="gallery-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
