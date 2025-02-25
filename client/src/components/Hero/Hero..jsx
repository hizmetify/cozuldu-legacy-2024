import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import HeroImg from '../../assets/hero-1.jpg';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Select Role');

  const popularSearches = [
    'Designer',
    'Developer',
    'Web',
    'iOS',
    'PHP',
    'Senior',
    'Engineer',
  ];

  return (
    <div className="relative min-h-[600px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${HeroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            İstediğin Hizmete Ulaş...{' '}
            <span className="relative font-bold uppercase text-transparent bg-gradient-to-r from-teal-500 to-green-800 bg-clip-text">
              Çözüldü
            </span>
          </h1>

          {/* Popular Searches */}
          {/*           <div className="mt-6 text-gray-200">
            <span className="text-sm mr-3">Popular Searches:</span>
            <div className="inline-flex flex-wrap gap-2 items-center">
              {popularSearches.map((term, index) => (
                <Link
                  key={index}
                  to={`/search?q=${term}`}
                  className="text-sm hover:text-blue-300 transition-colors"
                >
                  {term}
                  {index < popularSearches.length - 1 && (
                    <span className="ml-2">•</span>
                  )}
                </Link>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
