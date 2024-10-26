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

router.put('/budgets/:id', async (req, res) => {
	try {
		const { id } = req.params; 
		const updatedData = req.body;
		console.log("Updated Budget: " + JSON.stringify(updatedData, null, 2));

		const updatedBudget = await Budget.findByIdAndUpdate(id, updatedData);
		if (!updatedBudget) {
			return res.status(404).json({ message: 'Budget not found' });
		}
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error update updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after budget editing' });
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

router.delete('/budgets/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Budget.findByIdAndDelete(id);

		if (!result) {
			return res.status(404).json({ message: 'Budget not found' });
		}

		// recalculate values based on new budgets and sync with MongoDB
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after budget deletion' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Budget deleted and data updated successfully' });
		});
	} catch (error) {
		console.error('Error deleting budget:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

export default router;
