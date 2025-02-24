import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FaTrash, FaEnvelope, FaUser } from 'react-icons/fa';
import InputField from '../../components/UI/InputField';

const SettingsCard = ({
  icon: Icon,
  title,
  description,
  children,
  variant = 'default',
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
      variant === 'danger'
        ? 'hover:border-red-200 border-gray-100'
        : 'hover:border-blue-200 border-gray-100'
    }`}
  >
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-lg ${
            variant === 'danger' ? 'bg-red-50' : 'bg-blue-50'
          }`}
        >
          <Icon
            className={`text-xl ${
              variant === 'danger' ? 'text-red-500' : 'text-blue-500'
            }`}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6 bg-gray-50 rounded-b-xl">{children}</div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
            <p className="text-gray-500 mt-1">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SettingsCard
                  icon={FaEnvelope}
                  title="E-posta Adresi"
                  description="Hesabınıza bağlı e-posta adresini güncelleyin"
                >
                  <div className="space-y-4">
                    <InputField
                      name="email"
                      type="email"
                      placeholder="Yeni E-posta Adresi"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaEnvelope className="text-sm" />
                      {isSubmitting
                        ? 'Güncelleniyor...'
                        : 'E-posta Adresini Güncelle'}
                    </button>
                  </div>
                </SettingsCard>

                <SettingsCard
                  icon={FaUser}
                  title="Kişisel Bilgiler"
                  description="İsim ve soyisim bilgilerinizi güncelleyin"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="name"
                        type="text"
                        placeholder="Yeni İsim"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white"
                      />
                      <InputField
                        name="surname"
                        type="text"
                        placeholder="Yeni Soyisim"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaUser className="text-sm" />
                      {isSubmitting
                        ? 'Güncelleniyor...'
                        : 'İsim-Soyisim Güncelle'}
                    </button>
                  </div>
                </SettingsCard>

                <SettingsCard
                  icon={FaTrash}
                  title="Hesabı Sil"
                  description="Hesabınızı kalıcı olarak silin"
                  variant="danger"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak
                      silinecektir.
                    </p>
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
                      className="w-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FaTrash className="text-sm" />
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
