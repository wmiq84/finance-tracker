import express from 'express';
import Spending from '../models/Spending.js';

const router = express.Router();

router.get('/spendings', async (req, res) => {
	try {
		const spendings = await Spending.find().limit(50).sort({ createdOn: -1 });
		res.status(200).json(spendings);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

export default router;
