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

router.delete('/incomes/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Income.findByIdAndDelete(id); 

		if (!result) {
			return res.status(404).json({ message: 'Income not found' });
		}

		res.status(200).json({ message: 'Income deleted successfully' });
	} catch (error) {
		console.error('Error deleting income:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

export default router;
