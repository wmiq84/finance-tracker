// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import KPI from '../models/KPI.js';
// import Income from '../models/Income.js';
// import Spending from '../models/Spending.js';
// import Goal from '../models/Goal.js';
// import Budget from '../models/Budget.js';

// dotenv.config();
// const data = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));

// mongoose
// 	.connect(process.env.MONGO_URL, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	})
// 	.then(async () => {
// 		const kpiCount = await KPI.countDocuments();
// 		if (kpiCount === 0) {
// 			await KPI.insertMany(data.kpis);
// 			await Spending.insertMany(data.spendings);
// 			await Income.insertMany(data.incomes);
// 			await Goal.insertMany(data.goals);
// 			await Budget.insertMany(data.budgets);
// 			console.log('Initial data seeded to the database');
// 		}
// 	})
// 	.catch((error) => console.log(`${error} did not connect`));