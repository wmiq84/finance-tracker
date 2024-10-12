import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetKpisResponse, GetTransactionsResponse } from './types';

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
	reducerPath: 'main',
	tagTypes: ['Kpis', 'Transactions'],
	endpoints: (build) => ({
		getKpis: build.query<Array<GetKpisResponse>, void>({
			query: () => 'kpi/kpis/',
			providesTags: ['Kpis'],
		}),
		getTransactions: build.query<Array<GetTransactionsResponse>, void>({
			query: () => 'transaction/transactions/',
			providesTags: ['Transactions'],
		}),
	}),
});

export const { useGetKpisQuery, useGetTransactionsQuery } = api;
