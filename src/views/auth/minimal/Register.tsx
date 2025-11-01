import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button, Form, Stack } from 'react-bootstrap'
import AuthMinmal from './AuthMinmal'
import TitleHelmet from '../../../components/Common/TitleHelmet'
import AuthLayout from '../../../Layouts/AuthLayout'
import { useTranslation } from 'react-i18next'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// NUEVO: Importaciones para el campo de teléfono
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useForm, useWatch, Controller } from 'react-hook-form' // NUEVO: Importar Controller
import HCaptCha from '../../../components/UiElements/Base/Hcapctcha/Hcaptcha'
import { useRegisterUserMutation } from '../../../store/api/auth/authApiSlice'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useDispatch } from 'react-redux'
import VerificationSent from './VerificationSent'
import TerminosCondicionesModal from './TermsAndConditions'
import PoliticaPrivacidadModal from './PrivacyPolicyModal'

const generatePassword = (length: number): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~@#$%^&*(){}[]'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset.charAt(randomIndex)
  }
  return password
}


const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [termsConditions, setTermsConditions] = useState<boolean>(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)
  const [referralCode, setReferralCode] = useState<string>('')
  const [referralLink, setReferralLink] = useState<string>('')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { ref_code } = useParams()
  const dispatch = useDispatch()

  // Establecer el código de referencia desde la URL o permitir que el usuario lo ingrese
  useEffect(() => {
    if (ref_code) {
      setReferralCode(ref_code)
      setReferralLink(`https://backend.smartsolution.fund/api/auth/register/${ref_code}/`)
    }
  }, [ref_code])

  // Función para extraer el código del link
  const handleReferralLinkChange = (value: string) => {
    setReferralLink(value)
    
    // Intentar extraer el código del link
    // Patrón: https://backend.smartsolution.fund/api/auth/register/345346/
    const match = value.match(/\/register\/(\w+)\/?$/)
    if (match && match[1]) {
      setReferralCode(match[1])
    } else if (value && !value.includes('/')) {
      // Si solo ingresó el código sin link completo
      setReferralCode(value)
    }
  }

  // NUEVO: Añadimos 'phone' al esquema de validación
  const schema = yup
    .object({
      username: yup
        .string()
        .required(t("Username is required"))
        .matches(/^\S*$/, t("Username must not contain spaces")),
      email: yup.string().email(t("Invalid email")).required(t("Email is required")),
      phone_number: yup // NUEVO: Campo de teléfono
        .string()
        .required(t("Phone number is required"))
        .test('is-valid-phone', t('Phone number is not valid'), (value) => 
            isValidPhoneNumber(value || '') // Usamos la función de la librería para validar
        ),
      password: yup.string().required(t("Password is required")).min(8, t("The password must be at least 8 characters long."))
        .max(20, t("The password can only contain a maximum of 20 characters.")),
      password2: yup.string().required(t("Password confirmation is required")),
      hcaptcha: yup.string().required(t("Captcha is required")),
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const [registerUser, { isLoading, isSuccess, isError, error, data }] = useRegisterUserMutation()
  const [password, password2] = useWatch({ control, name: ["password", "password2"] })

  const handleGeneratePassword = () => {
    setValue("password", generatePassword(16))
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRegister = (data: RegisterCredentials) => {
    if (password !== password2) {
      toast.error(t('Passwords do not match'))
      return
    }
    if (!referralCode) {
      toast.error(t('Referral code is required'))
      return
    }
    registerUser({ data: data, ref_code: referralCode })
  }

  useEffect(() => {
    if (isSuccess) {
      // navigate("/dashboard")
      // dispatch(setIsAuthenticated(true))
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      if ('data' in (error as FetchBaseQueryError)) {
        toast.error((error as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isError, error]);

  return (
    <div>
      <TitleHelmet title={t("Register")} />
      <AuthLayout>
        <AuthMinmal>
          {!isSuccess ? (
            <>
              <div className="mb-12">
                <h4 className="fw-bold mb-3">{t("Create an Account")}</h4>
                <p className="fs-16 lead">
                  {t("Let's get you all set up, so you can verify your personal account and begin setting up your profile.")}
                </p>
              </div>
              <Form onSubmit={handleSubmit(handleRegister)}>
                <Form.Group className="mb-3">
                  <Form.Control
                    {...register("username")}
                    placeholder={t("Create a Username")}
                    isInvalid={!!errors?.username}
                  />
                  <Form.Control.Feedback type="invalid">{errors?.username?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    {...register("email")}
                    placeholder={t("Email")}
                    isInvalid={!!errors?.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors?.email?.message}</Form.Control.Feedback>
                </Form.Group>
                {/* Campo de Link de Referencia */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-muted small">
                    {t("Sponsor Referral Link")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://backend.smartsolution.fund/api/auth/register/345346/"
                    value={referralLink}
                    onChange={(e) => handleReferralLinkChange(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    {t("Paste the complete referral link from your sponsor")}
                  </Form.Text>
                  {referralCode && (
                    <div className="mt-2">
                      <small className="text-success">
                        <i className="fi fi-rr-check-circle me-1"></i>
                        {t("Code detected")}: <strong>{referralCode}</strong>
                      </small>
                    </div>
                  )}
                </Form.Group>
                {/* NUEVO: Campo de Teléfono con Controller */}
                <Form.Group className="mb-3">
                  <Controller
                    name="phone_number"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        placeholder={t("Enter phone number")}
                        defaultCountry="US" // Código de país por defecto (ej. Colombia)
                        international
                        withCountryCallingCode
                        className={errors.phone_number ? 'PhoneInput--invalid' : ''}
                      />
                    )}
                  />
                   <Form.Control.Feedback type="invalid" className="d-block">
                     {errors?.phone_number?.message}
                   </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t("Password")}
                    {...register("password")}
                    isInvalid={!!errors?.password}
                  />
                  <span
                    className="btn btn-icon position-absolute translate-middle top-50"
                    style={{ right: '1rem' }}
                    onClick={handleTogglePasswordVisibility}
                  >
                    <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
                  </span>
                  <span
                    className="btn btn-icon position-absolute translate-middle top-50"
                    style={{ right: '-1rem' }}
                    onClick={handleGeneratePassword}
                  >
                    <i className="fi fi-rr-magic-wand"></i>
                  </span>
                  <Form.Control.Feedback type="invalid">{errors?.password?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t("Confirm password")}
                    {...register("password2")}
                    isInvalid={!!errors?.password2}
                  />
                  <Form.Control.Feedback type="invalid">{errors?.password2?.message}</Form.Control.Feedback>
                </Form.Group>
                <Stack content='center' className='mt-4'>
                  <HCaptCha setToken={(value) => setValue("hcaptcha", value)} />
                  {errors?.hcaptcha && (
                    <span className='text-danger'>{errors?.hcaptcha?.message}</span>
                  )}
                </Stack>
                <Stack gap={2} className="text-start mt-4">
                  <Form.Check type="checkbox" id="check-api-terms-conditions">
                    <Form.Check.Input
                      type="checkbox"
                      checked={termsConditions}
                      onChange={() => setTermsConditions(!termsConditions)}
                      required
                    />
                    <Form.Check.Label>
                      {t("I agree to all the")}{' '}
                      <a href='#' onClick={(e) => { e.preventDefault(); setShowTerms(true) }}>{t("Terms & Conditions")}</a> {t("and the")} <a href='#' onClick={(e) => { e.preventDefault(); setShowPolicy(true) }}>{t("Privacy Policy")}</a>
                    </Form.Check.Label>
                  </Form.Check>
                </Stack>
                <div className="d-grid gap-2 my-4">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="text-white"
                  >
                    {isLoading ? (
                      <div>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </div>
                    ) : (
                      <div>{t("Register")}</div>
                    )}
                  </Button>
                </div>
                <div>
                  {t("Already have an account?")} <Link to="/auth/login">{t("Login")}</Link>
                </div>
              </Form>
            </>
          ) : (
            <VerificationSent />
          )}
          {showTerms && <TerminosCondicionesModal show={showTerms} setShow={setShowTerms} />}
          {showPolicy && <PoliticaPrivacidadModal show={showPolicy} setShow={setShowPolicy} />}
        </AuthMinmal>
      </AuthLayout>
    </div>
  )
}

export default Register