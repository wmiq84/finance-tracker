import express from 'express';
import Income from '../models/Income.js';

const router = express.Router();

router.get('/incomes', async (req, res) => {
	try {
		const incomes = await Income.find();
		res.status(200).json(incomes);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

export default router;
