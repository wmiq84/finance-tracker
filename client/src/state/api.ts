import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetKpisResponse, GetIncomesResponse, GetTransactionsResponse, GetGoalsResponse, GetBudgetsResponse } from './types';

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
	reducerPath: 'main',
	tagTypes: ['Kpis', 'Incomes', 'Transactions', 'Goals', 'Budgets'],
	endpoints: (build) => ({
		getKpis: build.query<Array<GetKpisResponse>, void>({
			query: () => 'kpi/kpis/',
			providesTags: ['Kpis'],
		}),
		getIncomes: build.query<Array<GetIncomesResponse>, void>({
			query: () => 'income/incomes/',
			providesTags: ['Incomes'],
		}),
		getTransactions: build.query<Array<GetTransactionsResponse>, void>({
			query: () => 'transaction/transactions/',
			providesTags: ['Transactions'],
		}),
		getGoals: build.query<Array<GetGoalsResponse>, void>({
			query: () => 'goal/goals/',
			providesTags: ['Goals'],
		}),
		getBudgets: build.query<Array<GetBudgetsResponse>, void>({
			query: () => 'budget/budgets/',
			providesTags: ['Budgets'],
		}),
	}),
});

export const { useGetKpisQuery, useGetIncomesQuery, useGetTransactionsQuery, useGetGoalsQuery, useGetBudgetsQuery } = api;
