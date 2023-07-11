// API: https://rapidapi.com/Coinranking/api/coinranking1
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const cryptoApiHeaders = {
	'X-RapidAPI-Key': '683e32143cmsh41a008e002a450bp164f2ejsnfb249f83544a',
	'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
}

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
	}),
})

export const { useGetCryptosQuery } = cryptoApi
