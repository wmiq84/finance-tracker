import express from 'express';
import Budget from '../models/Budget.js';
import { exec } from 'child_process';

const router = express.Router();

router.get('/budgets', async (req, res) => {
	try {
		const budgets = await Budget.find();
		res.status(200).json(budgets);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

router.post('/budgets', async (req, res) => {
	try {
		const updatedData = req.body;
		const updatedBudget = await Budget.create(updatedData);
		console.log("Updated Data: " + JSON.stringify(updatedBudget, null, 2));

		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error update updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after l editing' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Budget edited and data updated successfully' });
		});
	} catch (error) {
		console.error('Error editing budget:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

export default router;
