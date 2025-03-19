import { useState, useEffect } from 'react';
import { getFirstLetter } from '../../utils/getFirstLetter';

const stringToColor = (str) => {
  if (!str) return '#4b5563';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
};

const Avatar = ({
  profilePicture,
  name = '',
  size = 'w-12 h-12',
  textSize = 'text-xl',
  onClick,
  border = false,
  borderColor = 'border-white',
  borderWidth = 'border-4',
  isLoading = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profilePicture]);
  const isClickable = typeof onClick === 'function';

  const renderFallbackAvatar = () => {
    const initials = getFirstLetter(name);
    const bgColor = stringToColor(name);

    return (
      <div
        className={`
          ${size} 
          rounded-full 
          flex 
          items-center 
          justify-center 
          text-white 
          font-bold 
          uppercase 
          ${textSize}
          ${border ? `${borderWidth} ${borderColor}` : ''}
          ${
            isClickable
              ? 'cursor-pointer hover:opacity-90 transition-opacity'
              : ''
          }
          ${className}
        `}
        style={{ backgroundColor: bgColor }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isLoading ? (
          <div className="animate-pulse h-3/4 w-3/4 rounded-full bg-white/30" />
        ) : (
          initials
        )}
      </div>
    );
  };

  if (profilePicture && !imageError) {
    return (
      <div className="relative">
        <img
          src={profilePicture || '/placeholder.svg'}
          alt={name}
          className={`
            ${size} 
            rounded-full 
            object-cover 
            ${border ? `${borderWidth} ${borderColor}` : ''}
            ${
              isClickable
                ? 'cursor-pointer hover:opacity-90 transition-opacity'
                : ''
            }
            ${className}
          `}
          onClick={onClick}
          onError={() => setImageError(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          loading="lazy"
        />

        {isClickable && isHovered && (
          <div className="absolute inset-0 bg-black/10 rounded-full flex items-center justify-center">
            <span className="sr-only">Profil fotoğrafını görüntüle</span>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <div className="h-1/3 w-1/3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    );
  }
  return <div className="relative">{renderFallbackAvatar()}</div>;
};

export default Avatar;
