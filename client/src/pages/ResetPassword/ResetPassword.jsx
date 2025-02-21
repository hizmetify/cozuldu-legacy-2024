

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { showToast } from "../../features/toast/toastSlice"
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa"
import { passwordChange } from "../../api/authApi"
import InputField from "../../components/UI/InputField"

const ResetPassword = () => {
  const { email } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    password: Yup.string().min(8, "Parola en az 8 karakter olmalıdır").required("Parola gereklidir"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Parolalar eşleşmiyor")
      .required("Parola tekrarı gereklidir"),
  })

  const calculateStrength = (pass) => {
    let strength = 0
    if (pass.length >= 8) strength += 25
    if (/[A-Z]/.test(pass)) strength += 25
    if (/[0-9]/.test(pass)) strength += 25
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25
    return strength
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true)
    try {
      await passwordChange({ email, password: values.password })
      dispatch(
        showToast({
          type: "success",
          message: "Parolanız başarıyla güncellendi.",
        }),
      )
      navigate("/login")
    } catch (error) {
      dispatch(
        showToast({
          type: "error",
          message: "Parola güncellenirken bir hata oluştu.",
        }),
      )
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Parola Sıfırla</h2>
          <p className="text-gray-600">{email} için yeni parola oluşturun</p>
        </div>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, touched, errors }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <InputField label="Yeni Parola" name="password" type="password" placeholder="••••••••" />
                  {values.password && (
                    <div className="mt-2">
                      <div className="h-2 rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            calculateStrength(values.password) <= 25
                              ? "bg-red-500"
                              : calculateStrength(values.password) <= 50
                                ? "bg-orange-500"
                                : calculateStrength(values.password) <= 75
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                          }`}
                          style={{ width: `${calculateStrength(values.password)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Parola Gücü:{" "}
                        {calculateStrength(values.password) === 100
                          ? "Güçlü"
                          : calculateStrength(values.password) >= 50
                            ? "Orta"
                            : "Zayıf"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <InputField
                    label="Yeni Parola Tekrar"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                  {values.confirmPassword && (
                    <span className="absolute right-3 bottom-3">
                      {values.password === values.confirmPassword ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading || Object.keys(errors).length > 0}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2
                  ${
                    isSubmitting || isLoading || Object.keys(errors).length > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {(isLoading || isSubmitting) && <FaSpinner className="animate-spin mr-2" />}
                <span>Parolayı Güncelle</span>
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ResetPassword

