import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';

const Schema = mongoose.Schema;
loadType(mongoose);

const GoalSchema = new Schema(
	{
        title: {
            type: String,
        },
		amountSaved: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
        targetAmount: {
			type: mongoose.Types.Currency,
			currency: 'USD',
			get: (v) => v / 100,
		},
		dueDate: {
			type: Date,
		},
		completed: { 
            type: Boolean,
        },
	},
	{ timestamps: true, toJSON: { getters: true } }
);

const Goal = mongoose.model('Goals', GoalSchema);

export default Goal;
