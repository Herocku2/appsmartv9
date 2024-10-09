import { apiSlice } from "../apiSlice";

export const plansApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation<PaymentPlanResponse, { amount:number, payPasive?: boolean}>({
            query: (body) => ({
                url: `plans/create-investment-payment/`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ['User', 'Dashboard', 'Tree','InvestmentHistory']
        }),
        verifyPayment: builder.mutation<string, { txn_id: string}>({
            query: ({txn_id}) => ({
                url: `plans/verify-investment-amount/`,
                method: "POST",
                body: {txn_id: txn_id}
            }),
            invalidatesTags: ['User', 'Dashboard', 'Tree','InvestmentHistory']
        }),
        getInvestmentHistory: builder.query<InvestmentHistoryResponse, {page: string}>({
            query: (params) => ({
              url: "plans/history/?"+ new URLSearchParams(params),
            }),
            providesTags: ['InvestmentHistory']
          }),
    })
})

export const {useCreatePaymentMutation, useVerifyPaymentMutation, useGetInvestmentHistoryQuery} = plansApi