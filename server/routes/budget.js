import express from 'express';
import Budget from '../models/Budget.js';

const router = express.Router();

router.get('/budgets', async (req, res) => {
	try {
		const budgets = await Budget.find();
		res.status(200).json(budgets);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

export default router;
