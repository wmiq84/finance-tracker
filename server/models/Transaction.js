import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';

const Schema = mongoose.Schema;
loadType(mongoose);

const TransactionSchema = new Schema(
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

const Transaction = mongoose.model('Transactions', TransactionSchema);

export default Transaction;
