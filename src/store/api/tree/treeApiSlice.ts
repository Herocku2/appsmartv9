import { apiSlice } from "../apiSlice";

const treeURL = 'tree/get-binary-tree/'

export const treeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBinaryTree: builder.query<TreeLeaf[], void>({
      query: () => ({
        url: treeURL,
      }),
      providesTags: ['Tree']
    }),
    getReferrals: builder.query<ReferralResponse, {page: string}>({
      query: (params) => ({
        url: "tree/get-referrals/?" + new URLSearchParams(params),
      }),
      providesTags: ['Tree']
    }),
  }),
});
export const { useGetBinaryTreeQuery, useGetReferralsQuery } = treeApi;
