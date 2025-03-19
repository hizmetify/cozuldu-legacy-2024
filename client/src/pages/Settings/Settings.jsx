import { useState, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserEmail,
  updateUserName,
  removeUserAccount,
} from '../../features/user/userSlice';
import {
  FaTrash,
  FaEnvelope,
  FaUser,
  FaChevronRight,
  FaCamera,
  FaLock,
  FaBell,
  FaShieldAlt,
} from 'react-icons/fa';
import InputField from '../../components/UI/InputField';

const SettingsCard = ({
  icon: Icon,
  title,
  description,
  children,
  variant = 'default',
}) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border transition-all duration-300 mb-6 ${
      variant === 'danger'
        ? 'hover:border-red-300 border-red-100 hover:shadow-red-100'
        : 'hover:border-blue-300 border-blue-100 hover:shadow-blue-100'
    }`}
  >
    <div className="p-6 border-b">
      <div className="flex items-start gap-5">
        <div
          className={`p-4 rounded-xl ${
            variant === 'danger'
              ? 'bg-red-50 ring-4 ring-red-50/50'
              : 'bg-blue-50 ring-4 ring-blue-50/50'
          }`}
        >
          <Icon
            className={`text-xl ${
              variant === 'danger' ? 'text-red-500' : 'text-blue-500'
            }`}
          />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6 bg-gray-50/50 rounded-b-2xl">{children}</div>
  </div>
);

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all ${
      active
        ? 'bg-blue-100 text-blue-600 font-medium'
        : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    <Icon className={`text-lg ${active ? 'text-blue-500' : 'text-gray-500'}`} />
    <span>{label}</span>
  </button>
);

const Settings = () => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || '/default-avatar.png'
  );
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 rounded-xl mb-16 relative">
              <div className="absolute -bottom-2 left-8 flex items-end">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden">
                    <img
                      src={profileImage || '/placeholder.svg'}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaCamera size={14} />
                  </button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium">
                    Profil Yükle
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="ml-4 mb-2">
                  <h2 className="text-xl font-bold text-white drop-shadow-md">
                    {user?.name || 'Kullanıcı'} {user?.lastname || 'Adı'}
                  </h2>
                  <p className="text-blue-100 drop-shadow-sm">
                    {user?.email || 'kullanici@ornek.com'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaUser className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Kişisel Bilgiler
                  </h2>
                  <p className="text-gray-500 text-sm">
                    İsim ve soyisim bilgilerinizi güncelleyin
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <Formik
                  initialValues={{
                    name: user?.name || '',
                    surname: user?.lastname || '',
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().required('İsim gereklidir'),
                    surname: Yup.string().required('Soyisim gereklidir'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    dispatch(
                      updateUserName({
                        name: values.name,
                        lastname: values.surname,
                      })
                    );
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-500 text-sm mb-1 block">
                              İsim
                            </label>
                            <InputField
                              name="name"
                              type="text"
                              placeholder="İsim"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 text-sm mb-1 block">
                              Soyisim
                            </label>
                            <InputField
                              name="surname"
                              type="text"
                              placeholder="Soyisim"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || loading}
                          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                        >
                          <FaUser className="text-sm" />
                          {loading
                            ? 'Güncelleniyor...'
                            : 'İsim-Soyisim Güncelle'}
                          <FaChevronRight className="text-xs opacity-75" />
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaEnvelope className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    E-posta Adresi
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Hesabınıza bağlı e-posta adresini güncelleyin
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <Formik
                  initialValues={{ email: user?.email || '' }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email('Geçerli bir e-posta giriniz')
                      .required('E-posta gereklidir'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    dispatch(updateUserEmail(values.email));
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="space-y-6">
                        <div>
                          <label className="text-gray-500 text-sm mb-1 block">
                            E-posta Adresi
                          </label>
                          <InputField
                            name="email"
                            type="email"
                            placeholder="E-posta Adresi"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || loading}
                          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                        >
                          <FaEnvelope className="text-sm" />
                          {loading
                            ? 'Güncelleniyor...'
                            : 'E-posta Adresini Güncelle'}
                          <FaChevronRight className="text-xs opacity-75" />
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaLock className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Şifre Değiştirme
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-gray-500 text-sm mb-1 block">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Mevcut şifrenizi girin"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-sm mb-1 block">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Yeni şifrenizi girin"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 text-sm mb-1 block">
                      Şifre Tekrar
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <FaLock className="text-sm" />
                    Şifremi Güncelle
                    <FaChevronRight className="text-xs opacity-75" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaShieldAlt className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    İki Faktörlü Doğrulama
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Hesabınızı daha güvenli hale getirmek için iki faktörlü
                    doğrulamayı etkinleştirin
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      İki Faktörlü Doğrulama
                    </h3>
                    <p className="text-sm text-gray-500">
                      Hesabınıza giriş yaparken ek bir güvenlik katmanı ekler
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaBell className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Bildirim Ayarları
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Hangi bildirimler alacağınızı ve nasıl alacağınızı yönetin
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        E-posta Bildirimleri
                      </h3>
                      <p className="text-sm text-gray-500">
                        Önemli güncellemeler ve duyurular
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Tarayıcı Bildirimleri
                      </h3>
                      <p className="text-sm text-gray-500">
                        Anlık mesajlar ve hatırlatıcılar
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        SMS Bildirimleri
                      </h3>
                      <p className="text-sm text-gray-500">
                        Güvenlik uyarıları ve doğrulamalar
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'danger':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaTrash className="text-red-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Hesabı Sil
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Hesabınızı kalıcı olarak silin
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="space-y-6">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-sm text-red-600">
                      <strong>Uyarı:</strong> Bu işlem geri alınamaz. Hesabınız
                      ve tüm verileriniz kalıcı olarak silinecektir.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-gray-500 text-sm mb-1 block">
                        Hesap Şifreniz
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder="Güvenlik için şifrenizi girin"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        id="confirm-delete"
                        type="checkbox"
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor="confirm-delete"
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        Hesabımı silmek istediğimi onaylıyorum
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (
                        window.confirm(
                          'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
                        )
                      ) {
                        dispatch(
                          removeUserAccount(
                            prompt('Hesabınızı silmek için şifrenizi girin:')
                          )
                        );
                      }
                    }}
                    className="w-full bg-white hover:bg-red-50 active:bg-red-100 border-2 border-red-500 text-red-500 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <FaTrash className="text-sm" />
                    {loading ? 'Siliniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900">Ayarlar</h1>
            <p className="text-gray-500">
              Hesap ayarlarınızı buradan yönetebilirsiniz
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              <div className="p-4">
                <TabButton
                  active={activeTab === 'profile'}
                  icon={FaUser}
                  label="Profil"
                  onClick={() => setActiveTab('profile')}
                />
                <TabButton
                  active={activeTab === 'security'}
                  icon={FaLock}
                  label="Güvenlik"
                  onClick={() => setActiveTab('security')}
                />
                <TabButton
                  active={activeTab === 'notifications'}
                  icon={FaBell}
                  label="Bildirimler"
                  onClick={() => setActiveTab('notifications')}
                />
                <TabButton
                  active={activeTab === 'danger'}
                  icon={FaTrash}
                  label="Hesabı Sil"
                  onClick={() => setActiveTab('danger')}
                />
              </div>
            </div>
          </div>
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
