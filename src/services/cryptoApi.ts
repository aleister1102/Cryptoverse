// API: https://rapidapi.com/Coinranking/api/coinranking1
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const cryptoApiHeaders = {
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
    'X-RapidAPI-Key': `${import.meta.env.VITE_RAPID_API_KEY}`,
}
console.log(cryptoApiHeaders)

const baseUrl = 'https://coinranking1.p.rapidapi.com'

// RapidAPI requires the headers to be passed in the request query
function createRequest(url: string) {
    return { url, headers: cryptoApiHeaders }
}

// Reference: https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics#defining-an-api-slice
export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptos: builder.query<any, number>({
            query: (count) => createRequest(`/coins?limit=${count}`),
        }),
        getCryptoDetails: builder.query({
            query: (coinId) => createRequest(`/coin/${coinId}`),
        }),
        getCryptoHistory: builder.query({
            query: ({ coinId, timePeriod }) => createRequest(`/coin/${coinId}/history?timePeriod=${timePeriod}`),
        }),
    }),
})

export const { useGetCryptosQuery, useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } = cryptoApi
