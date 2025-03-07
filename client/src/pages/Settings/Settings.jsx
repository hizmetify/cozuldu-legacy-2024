import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserEmail, updateUserName, removeUserAccount } from '../../features/user/userSlice';
import { FaTrash, FaEnvelope, FaUser, FaChevronRight } from 'react-icons/fa';
import InputField from '../../components/UI/InputField';

const SettingsCard = ({ icon: Icon, title, description, children, variant = 'default' }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
      variant === 'danger'
        ? 'hover:border-red-300 border-red-50 hover:shadow-red-100'
        : 'hover:border-blue-300 border-blue-50 hover:shadow-blue-100'
    }`}
  >
    <div className="p-8 border-b">
      <div className="flex items-start gap-5">
        <div
          className={`p-4 rounded-xl ${
            variant === 'danger' ? 'bg-red-50 ring-8 ring-red-50/50' : 'bg-blue-50 ring-8 ring-blue-50/50'
          }`}
        >
          <Icon className={`text-2xl ${variant === 'danger' ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-8 bg-gray-50/50 rounded-b-2xl">{children}</div>
  </div>
);

const Settings = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900">Ayarlar</h1>
            <p className="text-gray-500 text-lg">Hesap ayarlarınızı buradan yönetebilirsiniz</p>
          </div>
        </div>

        {/* E-POSTA GÜNCELLEME FORMU */}
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Geçerli bir e-posta giriniz').required('E-posta gereklidir'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(updateUserEmail(values.email));
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <SettingsCard icon={FaEnvelope} title="E-posta Adresi" description="Hesabınıza bağlı e-posta adresini güncelleyin">
                <div className="space-y-6">
                  <InputField name="email" type="email" placeholder="Yeni E-posta Adresi" />
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <FaEnvelope className="text-base" />
                    {loading ? 'Güncelleniyor...' : 'E-posta Adresini Güncelle'}
                    <FaChevronRight className="text-sm opacity-75" />
                  </button>
                </div>
              </SettingsCard>
            </Form>
          )}
        </Formik>

        {/* İSİM-SOYİSİM GÜNCELLEME FORMU */}
        <Formik
          initialValues={{ name: '', surname: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('İsim gereklidir'),
            surname: Yup.string().required('Soyisim gereklidir'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(updateUserName({ name: values.name, lastname: values.surname }));
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <SettingsCard icon={FaUser} title="Kişisel Bilgiler" description="İsim ve soyisim bilgilerinizi güncelleyin">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField name="name" type="text" placeholder="Yeni İsim" />
                    <InputField name="surname" type="text" placeholder="Yeni Soyisim" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <FaUser className="text-base" />
                    {loading ? 'Güncelleniyor...' : 'İsim-Soyisim Güncelle'}
                    <FaChevronRight className="text-sm opacity-75" />
                  </button>
                </div>
              </SettingsCard>
            </Form>
          )}
        </Formik>

        {/* HESAP SİLME BUTONU */}
        <SettingsCard icon={FaTrash} title="Hesabı Sil" description="Hesabınızı kalıcı olarak silin" variant="danger">
          <div className="space-y-6">
            <div className="p-4 bg-red-50 rounded-xl border-2 border-red-100">
              <p className="text-sm text-red-600">Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.</p>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (window.confirm('Hesabınızı silmek istediğinizden emin misiniz?')) {
                  dispatch(removeUserAccount(prompt('Hesabınızı silmek için şifrenizi girin:')));
                }
              }}
              className="w-full bg-white hover:bg-red-50 active:bg-red-100 border-2 border-red-500 text-red-500 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <FaTrash className="text-base transition-transform group-hover:rotate-12" />
              {loading ? 'Siliniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
            </button>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Settings;
