import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';

const Schema = mongoose.Schema;
loadType(mongoose);

const TransactionSchema = new Schema(
	{
		buyer: {
			type: String,
			required: true,
		},
		amount: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		incomeIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Income',
			},
		],
	},
	{ timestamps: true, toJSON: { getters: true } }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
