import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import * as yup from "yup"
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import CreateDepositModal from './DepositModal';
import { useCreatePaymentMutation } from '../../../store/api/investment_plans/plansApiSlice';

export default function DepositsForm() {

  const { t } = useTranslation()


  let schema = yup
    .object({
      amount: yup
        .number()
        .required(t("Amount is required"))
        .typeError(t("Amount is invalid"))
        .positive(t("Amount must be positive")),
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });


  type PaymentForm = yup.InferType<typeof schema>;

  const [createPayment, { isLoading, isSuccess, isError, error, data  }] = useCreatePaymentMutation()
  const [openModal, setOpenModal] = useState(false)

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

  function handleSubmitPayment(data: PaymentForm) {
    createPayment(data)
  }


  useEffect(() => {
    if (isSuccess) {
      reset()
      toast.success(t("Deposit transaction made successfully!"))
    }
  }, [isSuccess])

  useEffect(() => {
    if (data) {
      setOpenModal(true)
    }
  }, [data])

  return (
    <div className='row'>
      <Form className='col-xl-4 col-md-6 mx-auto border p-4 rounded-2' onSubmit={handleSubmit(handleSubmitPayment)}>
        <Form.Group className='mt-4'>
          <Form.Label>{t("Deposit Amount")}</Form.Label>
          <Form.Control
            {...register("amount")}
            placeholder={"$"}
            isInvalid={!!errors?.amount}
          />
          <Form.Control.Feedback type="invalid">{errors?.amount?.message}</Form.Control.Feedback>
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
              {t("Create deposit")}
            </div>
          )}
        </Button>
      </Form>
      {
        (data && openModal) && (
          <CreateDepositModal activeModal={openModal} handleCloseModal={() => setOpenModal(false)}
            data={data} onGenerateNewTransaction={() => createPayment({"amount":parseInt(data?.amount)})}
          />
        )
      }

    </div>
  )
}
