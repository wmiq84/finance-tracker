export interface SpendingByCategories{
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
	totalProfit: number;
	totalIncome: number;
	totalSpending: number;
	spendingByCategories: number;
    monthlyData: Array<Month>;
    dailyData: Array<Day>;
}
