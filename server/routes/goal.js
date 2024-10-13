import express from 'express';
import Goal from '../models/Goal.js';

const router = express.Router();

router.get('/goals', async (req, res) => {
	try {
		const goals = await Goal.find();
		res.status(200).json(goals);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

export default router;
