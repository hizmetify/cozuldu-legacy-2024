import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FaTrash, FaEnvelope, FaUser, FaChevronRight } from 'react-icons/fa';
import InputField from '../../components/UI/InputField';

const SettingsCard = ({
  icon: Icon,
  title,
  description,
  children,
  variant = 'default',
}) => (
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
            variant === 'danger'
              ? 'bg-red-50 ring-8 ring-red-50/50'
              : 'bg-blue-50 ring-8 ring-blue-50/50'
          }`}
        >
          <Icon
            className={`text-2xl ${
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
    <div className="p-8 bg-gray-50/50 rounded-b-2xl">{children}</div>
  </div>
);

const Settings = () => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Geçerli bir e-posta adresi giriniz')
      .required('E-posta adresi gereklidir'),
    name: Yup.string().required('İsim gereklidir'),
    surname: Yup.string().required('Soyisim gereklidir'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900">Ayarlar</h1>
            <p className="text-gray-500 text-lg">
              Hesap ayarlarınızı buradan yönetebilirsiniz
            </p>
          </div>
        </div>

        <Formik
          initialValues={{ email: '', name: '', surname: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              console.log('Form değerleri:', values);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SettingsCard
                  icon={FaEnvelope}
                  title="E-posta Adresi"
                  description="Hesabınıza bağlı e-posta adresini güncelleyin"
                >
                  <div className="space-y-6">
                    <InputField
                      name="email"
                      type="email"
                      placeholder="Yeni E-posta Adresi"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white placeholder-gray-400 text-gray-600"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <FaEnvelope className="text-base" />
                      {isSubmitting
                        ? 'Güncelleniyor...'
                        : 'E-posta Adresini Güncelle'}
                      <FaChevronRight className="text-sm opacity-75" />
                    </button>
                  </div>
                </SettingsCard>

                <SettingsCard
                  icon={FaUser}
                  title="Kişisel Bilgiler"
                  description="İsim ve soyisim bilgilerinizi güncelleyin"
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="name"
                        type="text"
                        placeholder="Yeni İsim"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white placeholder-gray-400 text-gray-600"
                      />
                      <InputField
                        name="surname"
                        type="text"
                        placeholder="Yeni Soyisim"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white placeholder-gray-400 text-gray-600"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <FaUser className="text-base" />
                      {isSubmitting
                        ? 'Güncelleniyor...'
                        : 'İsim-Soyisim Güncelle'}
                      <FaChevronRight className="text-sm opacity-75" />
                    </button>
                  </div>
                </SettingsCard>

                <SettingsCard
                  icon={FaTrash}
                  title="Hesabı Sil"
                  description="Hesabınızı kalıcı olarak silin"
                  variant="danger"
                >
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 rounded-xl border-2 border-red-100">
                      <p className="text-sm text-red-600 leading-relaxed">
                        Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz
                        kalıcı olarak silinecektir.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            'Hesabınızı silmek istediğinizden emin misiniz?'
                          )
                        ) {
                          console.log('Hesap siliniyor');
                        }
                      }}
                      className="w-full bg-white hover:bg-red-50 active:bg-red-100 border-2 border-red-500 text-red-500 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                      <FaTrash className="text-base transition-transform group-hover:rotate-12" />
                      Hesabımı Kalıcı Olarak Sil
                    </button>
                  </div>
                </SettingsCard>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Settings;
