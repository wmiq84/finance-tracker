import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';

const Schema = mongoose.Schema;
loadType(mongoose);

const daySchema = new Schema(
	{
		date: String,
		income: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		spending: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
	},
	{ toJSON: { getters: true } }
);

const monthSchema = new Schema(
	{
		month: String,
		income: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		spending: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
	},
	{ toJSON: { getters: true } }
);

const KPISchema = new Schema(
	{
		totalProfit: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		totalIncome: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		totalSpending: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		incomeByCategory: {
			type: Map,
			of: {
				type: mongoose.Types.Currency,
				currency: 'USD',
				get: (v) => v / 100,
			},
		},
		spendingByCategory: {
			type: Map,
			of: {
				type: mongoose.Types.Currency,
				currency: 'USD',
				get: (v) => v / 100,
			},
		},
		monthlyData: [monthSchema],
		dailyData: [daySchema],
	},
	{ timestamps: true, toJSON: { getters: true } }
);

const KPI = mongoose.model('KPI', KPISchema);
export default KPI;
