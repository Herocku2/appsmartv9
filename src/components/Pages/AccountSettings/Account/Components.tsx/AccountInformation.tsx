import { Form, Row, Col, Button } from 'react-bootstrap'
import 'flatpickr/dist/themes/airbnb.css'
import { useTranslation } from 'react-i18next'
import { useGetUserQuery, useUpdateProfileMutation } from '../../../../../store/api/auth/authApiSlice'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AccountInformation = () => {

  const { t } = useTranslation()

  const { data: user } = useGetUserQuery()

  const schema = yup.object({
    email: yup.string().email(t('Email must be a valid email')).required(t('Email is required')),
    first_name: yup.string().required(t('First name is required')),
    last_name: yup.string().required(t('Last name is required')),
    phone_number: yup
      .string()
      .required(t('Phone number is required'))
      .test('is-valid-phone', t('Phone number is not valid'), (value) =>
        isValidPhoneNumber(value || '')
      ), usdt_wallet: yup.string().required(t('USDT wallet is required')),
    secret_code: yup.string().required(t('Secret code is required')),
  }).required();

  // Infer the form type from the yup schema
  type UserForm = yup.InferType<typeof schema>;

  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<UserForm>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    if (user) {
      setValue("email", user.email)
      setValue("first_name", user.first_name)
      setValue("last_name", user.last_name)
      setValue("phone_number", user.phone_number)
      setValue("usdt_wallet", user.usdt_wallet)
    }
  }, [user])

  const [updateProfile, { isLoading, isSuccess, isError, error, data }] = useUpdateProfileMutation()

  const onSubmit = (data: UserForm) => {
    updateProfile(data)
  };

  useEffect(() => {
    if (isError) {
      // Check if the error is a FetchBaseQueryError
      if ('data' in (error as FetchBaseQueryError)) {
        toast.error((error as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        toast.success(data.toString(), { duration: 5000 })
      }

    }
  }, [isSuccess])


  return (
    <div>
      <div className="mb-6 mb-md-12">
        <h5 className="fw-semibold">{t("Personal Information")}</h5>
        <p>{t("Basic info, like your name and address that will displayed in public")}</p>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-md-4 mb-4">
          <Col md={3}>
            <Form.Label className="fw-medium">{t("First name")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Group >
              <Form.Control
                {...register('first_name')}
                isInvalid={!!errors?.first_name}
                type="text" placeholder="First name" />
              <Form.Control.Feedback type="invalid">{errors?.first_name?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-md-4 mb-4">
          <Col md={3}>
            <Form.Label className="fw-medium">{t("Last name")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Group >
              <Form.Control
                {...register('last_name')}
                isInvalid={!!errors?.last_name}
                type="text" placeholder="Last Name" />
              <Form.Control.Feedback type="invalid">{errors?.last_name?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-md-4 mb-4">
          <Col md={3}>
            <Form.Label className="fw-medium">{t("Email")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Group>
              <Form.Control
                {...register('email')}
                isInvalid={!!errors?.email}
                type="email" placeholder="Email" />
              <Form.Control.Feedback type="invalid">{errors?.email?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-md-4 mb-4">
          <Col md={3}>
            <Form.Label className="fw-medium">{t("Phone")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Group>
              {/* NUEVO: Reemplazamos el Form.Control por el Controller con PhoneInput */}
              <Controller
                name="phone_number" // Usamos el nombre de campo que necesitas
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    placeholder={t("Enter phone number")}
                    defaultCountry="CO" // Puedes cambiar el país por defecto
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
          </Col>
        </Row>
        <Row className="g-md-4 mb-4">
          <Col md={3}>
            <Form.Label className="fw-medium">{t("Wallet USDT (BEP20)")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Group>
              <Form.Control
                {...register('usdt_wallet')}
                isInvalid={!!errors?.usdt_wallet}
                type="tel" placeholder="USDT wallet" />
              <Form.Control.Feedback type="invalid">{errors?.usdt_wallet?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-md-4 mb-4">
          <Col md={3}>
            <Form.Label className="fw-medium">{t("Secret code")}</Form.Label>
          </Col>
          <Col md={9} xl={8} xxl={6}>
            <Form.Group>
              <Form.Control
                {...register('secret_code')}
                isInvalid={!!errors?.secret_code}
                type="tel" placeholder="Secret code" />
              <Form.Control.Feedback type="invalid">{errors?.secret_code?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button variant='info' className='mt-4' onClick={() => updateProfile({ secret_code: "" })}>
              {t("Send secret code")}
            </Button>
          </Col>
        </Row>
        <Button type='submit'>
          {(isLoading) ? (
            <div>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </div>
          ) : (
            <div>
              {t("Submit")}
            </div>

          )}

        </Button>
      </Form>
    </div>
  )
}

export default AccountInformation
