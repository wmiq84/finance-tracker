import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import kpiRoutes from './routes/kpi.js';
import incomeRoutes from './routes/income.js';
import spendingRoutes from './routes/spending.js';
import goalRoutes from './routes/goal.js';
import budgetRoutes from './routes/budget.js';
import KPI from './models/KPI.js';
import Income from './models/Income.js';
import Spending from './models/Spending.js';
import Goal from './models/Goal.js';
import Budget from './models/Budget.js';
// import { kpis, incomes, spendings, goals, budgets } from './data/data.js';

// configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use('/kpi', kpiRoutes);
app.use('/income', incomeRoutes);
app.use('/spending', spendingRoutes);
app.use('/goal', goalRoutes);
app.use('/budget', budgetRoutes);

// load data from json
const data = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));

// mongoose setup
const PORT = process.env.PORT || 9000;
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(async () => {
		app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
		const kpiCount = await KPI.countDocuments();
		if (kpiCount === 0) {
			await KPI.insertMany(data.kpis);
			await Spending.insertMany(data.spendings);
			await Income.insertMany(data.incomes);
			await Goal.insertMany(data.goals);
			await Budget.insertMany(data.budgets);
			console.log('Initial data seeded to the database');
		}
	})
	.catch((error) => console.log(`${error} did not connect`));
