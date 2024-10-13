export interface IncomeByCategories {
	salaries: number;
	gifts: number;
	investments: number;
	miscellaneous: number,
}

export interface SpendingByCategories {
	food: number;
	supplies: number;
	services: number;
	miscellaneous: number,
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
	__v: number;
	totalIncome: number;
	totalSpending: number;
	incomeByCategories: number;
	spendingByCategories: number;
	monthlyData: Array<Month>;
	dailyData: Array<Day>;
}

export interface GetIncomesResponse {
	id: string;
	__v: number;
	amount: number;
	expense: number;
	transactions: Array<string>;
	createdAt: string;
	updatedAt: string;
}

export interface GetTransactionsResponse {
	id: string;
	__v: number;
	amount: number;
	buyer: string;
	incomeIds: Array<string>;
	createdAt: string;
	updatedAt: string;
}


export interface GetGoalsResponse {
	id: string;
	__v: number;
	title: string;
	amountSaved: number;
	targetAmount: number;
	dueDate: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}


export interface GetBudgetsResponse {
	id: string;
	__v: number;
	title: string;
	amountSpent: number;
	targetAmount: number;
	dueDate: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}