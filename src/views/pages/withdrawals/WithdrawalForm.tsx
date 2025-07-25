import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import * as yup from "yup"
import Select from 'react-select'
import { useCreateSecretCodeMutation, useCreateWithdrawalMutation } from '../../../store/api/withdrawals/withdrawalsApiSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';


export default function WithdrawalForm() {

  const { t } = useTranslation()

  const withdrawalOptions = [
    { value: "2", label: t("Balance withdrawal") },
    { value: "1", label: t("Earnings withdrawal or Investment") }
  ]


  const [createCode, { isLoading: isLoadingCode, isSuccess: isSuccessCode, isError: isErrorCode, error: errorCode, data: dataCode }] = useCreateSecretCodeMutation()

  const { data: user } = useGetUserQuery()

  let schema = yup
    .object({
      amount: yup
        .number()
        .required(t("Amount is required"))
        .typeError(t("Amount is invalid"))
        .positive(t("Amount must be positive")),
      wallet_address: yup.string().required(t("Wallet address USDT BEP20 is required.")),
      used_code: yup.string().required(t("Secret code is required.")),
      type: yup.string().required(t("Withdrawal type is required."))
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    control,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const walletOptions = [
    { value: user?.usdt_wallet, label: user?.usdt_wallet },
  ]

  type WithdrawalForm = yup.InferType<typeof schema>;

  const [wallet_address, type] = useWatch({ control, name: ['wallet_address', "type"] })

  const [createWithdrawal, { isLoading, isSuccess, isError, error }] = useCreateWithdrawalMutation()

  useEffect(() => {
    if (isSuccessCode) {
      toast.success(dataCode)
    }
  }, [isSuccessCode])


  useEffect(() => {
    if (isErrorCode) {
      // Check if the error is a FetchBaseQueryError
      if ('data' in (errorCode as FetchBaseQueryError)) {
        toast.error((errorCode as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isErrorCode, errorCode,]);

  useEffect(() => {
    if (isError) {
      // Check if the error is a FetchBaseQueryError
      if ('data' in (error as FetchBaseQueryError)) {
        toast.error((error as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isError, error,]);

  function handleSubmitWithdrawal(data: WithdrawalForm) {
    createWithdrawal(data)
  }


  useEffect(() => {
    if (isSuccess) {
      reset()
      toast.success(t("Withdrawal made successfully!"))
    }
  }, [isSuccess])

  function changeValue(attr: "amount" | "wallet_address" | "used_code" | "type", value: string) {
    if (value == "" && attr == "wallet_address") {
      toast.error(t("Wallet invalid, register USDT wallet on profile section and try again!"))
    }
    setValue(attr, value)
    trigger(attr)
  }


  return (
    <div className='row'>
      <Form className='col-xl-4 col-md-6 mx-auto border p-4 rounded-2' onSubmit={handleSubmit(handleSubmitWithdrawal)}>
        <p>{t("Withdrawals are processing 24 hours")}</p>
        <p>{t("Withdrawals are only available on Friday and Saturday")}</p>
        <Form.Group controlId="eventColor" className='mt-4'>
          <Form.Label>{t("Withdrawal Type")}</Form.Label>
          <Select
            classNamePrefix="select"
            className={`select ${errors?.type ? '' : 'is-invalid'}`}
            options={withdrawalOptions}
            onChange={(value) => { changeValue("type", value?.value || "") }}
            value={withdrawalOptions.find(val => val.value == wallet_address)}
          />
          <span className='text-danger' >{errors?.wallet_address?.message}</span>

        </Form.Group>
        <div className='mt-4'></div>
        {
          (type == "2") ? (
            <p>{t("Available balance")} <span className='fw-bold'>${user?.balance.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} USD</span></p>

          ) : (type == "1") ? (
            <p>{t("Earnings balance")} <span className='fw-bold'>${user?.investment_balance.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})} USD</span></p>

          ) : (
            <p className='mt-4'>{t("Please select a withdrawal type.")}</p>
          )
        }
        <Form.Group className='mt-4'>
          <Form.Label>{t("Amount")}</Form.Label>
          <Form.Control
            {...register("amount")}
            placeholder={"$"}
            isInvalid={!!errors?.amount}
          />
          {/* <p className='mt-2 text-muted'>+ {t("Comission fee 5%")} = {parseFloat(amount?.toString()) + (parseFloat(amount?.toString()) * 0.05) || 0}</p> */}
          <Form.Control.Feedback type="invalid">{errors?.amount?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="eventColor" className='mt-4'>
          <Form.Label>{t("Wallet")}</Form.Label>
          <Select
            classNamePrefix="select"
            className={`select ${errors?.wallet_address ? '' : 'is-invalid'}`}
            options={walletOptions}
            onChange={(value) => { changeValue("wallet_address", value?.value || "") }}
            value={walletOptions.find(val => val.value == wallet_address)}
          />
          <span className='text-danger' >{errors?.wallet_address?.message}</span>

        </Form.Group>
        <div className=' mt-4 d-flex justify-content-center'>
          {
            !isSuccessCode ? (
              <Button variant='info' className='mx-auto' onClick={() => createCode()}>
                {isLoadingCode ? (
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
                    {t("Generate secret code")}
                  </div>
                )}</Button>
            ) : (
              <a href="#" onClick={(e) => createCode()} className='link-opacity-100'>{t("Try again")}</a>
            )
          }


        </div>
        {/* <p className='text-center mt-1'>{t("Verify your email inbox")}</p> */}
        <Form.Group controlId="eventColor" className='mt-4'>
          <Form.Label>{t("Secret code")}</Form.Label>
          <Form.Control
            {...register("used_code")}
            placeholder={t("Code")}
            isInvalid={!!errors?.used_code}
          />
          <Form.Control.Feedback type="invalid">{errors?.used_code?.message}</Form.Control.Feedback>
        </Form.Group>
        <Button className='col-12 mt-4' type='submit'>
          {isLoading ? (
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
