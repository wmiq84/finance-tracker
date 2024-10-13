import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import kpiRoutes from './routes/kpi.js';
import incomeRoutes from './routes/income.js';
import transactionRoutes from './routes/transaction.js';
import goalRoutes from './routes/goal.js'
import KPI from './models/KPI.js';
import Income from './models/Income.js';
import Transaction from './models/Transaction.js';
import Goal from './models/Goal.js';
import { kpis, incomes, transactions, goals } from './data/data.js';

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
app.use('/transaction', transactionRoutes);
app.use('/goal', goalRoutes);

// mongoose setup
const PORT = process.env.PORT || 9000;
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(async () => {
		app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
		// comment out after initial
		await mongoose.connection.db.dropDatabase();
		KPI.insertMany(kpis);
		Transaction.insertMany(transactions);
		Income.insertMany(incomes);
		Goal.insertMany(goals);
	})
	.catch((error) => console.log(`${error} did not connect`));
