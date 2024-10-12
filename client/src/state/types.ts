export interface SpendingByCategories {
	salaries: number;
	supplies: number;
	services: number;
}

export interface Month {
	id: string;
	month: string;
	income: number;
	spending: number;
	nonOperationalSpending: number;
	operationalSpending: number;
}

export interface Day {
	id: string;
	date: string;
	income: number;
	spending: number;
}

export interface GetKpisResponse {
	id: string;
	_id: string;
	__v: number;
	totalIncome: number;
	totalSpending: number;
	spendingByCategories: number;
	monthlyData: Array<Month>;
	dailyData: Array<Day>;
}

export interface GetIncomesResponse {
	id: string;
	_id: string;
	__v: number;
	amount: number;
	expense: number;
	transactions: Array<string>;
	createdAt: string;
	updatedAt: string;
}

export interface GetTransactionsResponse {
	id: string;
	_id: string;
	__v: number;
	amount: number;
	buyer: string;
	incomeIds: Array<string>;
	createdAt: string;
	updatedAt: string;
}
