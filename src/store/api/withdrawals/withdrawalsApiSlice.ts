import { apiSlice } from "../apiSlice";

const withdrawalsURL = 'withdrawals/withdrawals/'

export const withdrawalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWithdrawals: builder.query<WithdrawalsResponse, {}>({
      query: (params) => ({
        url: withdrawalsURL+"?"+ new URLSearchParams(params),
      }),
      providesTags: ['Withdrawals']
    }),
    createWithdrawal: builder.mutation<string, {}>({
      query: (body) => ({
        url: withdrawalsURL,
        body: body,
        method: "POST"
      }),
      invalidatesTags: ['User', 'Withdrawals']
    }),
    createSecretCode:  builder.mutation<string, void>({
      query: () => ({
        url: 'withdrawals/withdrawals/create-code/',
        method: "POST"
      }),
    }),
  }),
});
export const { useCreateWithdrawalMutation, useGetWithdrawalsQuery, useCreateSecretCodeMutation } = withdrawalsApi;
