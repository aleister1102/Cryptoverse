// API: https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/bing-news-search1/
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface CryptoNewsQueryParams {
    newsCategory: string
    count: number
}

const cryptoNewsApiHeaders = {
    'X-BingApis-SDK': 'true',
    'X-RapidAPI-Key': `${import.meta.env.VITE_RAPID_API_KEY}`,
    'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com',
}

const baseUrl = 'https://bing-news-search1.p.rapidapi.com'

function createRequest(url: string) {
    return { url, headers: cryptoNewsApiHeaders }
}

export const cryptoNewsApi = createApi({
    reducerPath: 'cryptoNewsApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptoNews: builder.query<any, CryptoNewsQueryParams>({
            query: ({ newsCategory, count }) =>
                createRequest(
                    `/news/search?q=${newsCategory}&safeSearch=Off&textFormat=Raw&freshness=Day&count=${count}`,
                ),
        }),
    }),
})

export const { useGetCryptoNewsQuery } = cryptoNewsApi
