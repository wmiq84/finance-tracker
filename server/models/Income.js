import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';

const Schema = mongoose.Schema;
loadType(mongoose);

const IncomeSchema = new Schema(
	{
		amount: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		date: {
			type: Date,
		},
		category: { 
            type: String,
        },
	},
	{ timestamps: true, toJSON: { getters: true } }
);

const Income = mongoose.model('Income', IncomeSchema);

export default Income;
