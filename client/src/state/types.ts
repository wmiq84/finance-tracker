export interface ExpensesByCategories{
    salaries: number;
    supplies: number;
    services: number;
}

export interface Month {
    id: string;
    month: string;
    income: number;
    expenses: number;
    nonOperationalExpenses: number;
    operationalExpenses: number;
}

export interface Day {
    id: string;
    date: string;
    income: number;
    expenses: number;
}


export interface GetKpisResponse {
	id: string;
	_id: string;
	__v: number;
	totalProfit: number;
	totalIncome: number;
	totalExpenses: number;
	expensesByCategories: number;
    monthlyData: Array<Month>;
    dailyData: Array<Day>;
}
