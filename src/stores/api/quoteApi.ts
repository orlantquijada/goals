import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const qouteApi = createApi({
  reducerPath: 'stoicApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://daily.orlan.dev/api' }),
  endpoints: (builder) => ({
    getDailyQuote: builder.query<string, void>({
      query: () => '/daily',
      transformResponse: (response: { quote: string }) => response.quote,
    }),
  }),
});

export const { useGetDailyQuoteQuery } = qouteApi;
export default qouteApi;