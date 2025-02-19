import { useState, useEffect } from 'react';
import { BiSearch } from 'react-icons/bi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { fetchCategories } from '../../api/categoryApi';

export default function Hero() {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Kategorileri alırken hata oluştu:', error);
      }
    };

    getCategories();
  }, []);

  return (
    <main className="relative h-[calc(100vh-64px)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.jpg"
          alt="hero-image"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-white">
        <div className="max-w-4xl space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            İhtiyacınız olan en iyi freelancer'ları bulun
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-200 sm:text-xl">
            Binlerce profesyonel freelancer ile projelerinizi hayata geçirin.
          </p>
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <BiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Ne aradığınızı yazın..."
                className="h-12 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-black outline-none transition-all
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4
               text-black transition-all hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
               sm:w-[180px]"
              >
                <span className="text-gray-600">
                  {selectedCategory || 'Kategori Seç'}
                </span>
                <IoMdArrowDropdown className="h-5 w-5 text-gray-500" />
              </button>

              {isSelectOpen && (
                <div className="absolute bottom-full mb-2 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setIsSelectOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-500">
                      Kategoriler yükleniyor...
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              className="h-12 rounded-md bg-blue-600 px-8 font-medium text-white transition-colors hover:bg-blue-700
                               focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Ara
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-gray-300">Popüler Aramalar:</span>
            {[
              'Tasarımcı',
              'Geliştirici',
              'Web',
              'iOS',
              'PHP',
              'Senior',
              'Mühendis',
            ].map((term) => (
              <button
                key={term}
                className="text-gray-200 underline-offset-4 hover:text-white hover:underline"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
