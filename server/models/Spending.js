import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';

const Schema = mongoose.Schema;
loadType(mongoose);

const SpendingSchema = new Schema(
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

const Spending = mongoose.model('Spendings', SpendingSchema);

export default Spending;
