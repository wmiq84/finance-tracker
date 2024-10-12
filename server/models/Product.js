import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';

const Schema = mongoose.Schema;
loadType(mongoose);

const ProductSchema = new Schema(
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

const Product = mongoose.model('Product', ProductSchema);

export default Product;
