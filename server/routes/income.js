import express from 'express';
import Income from '../models/Income.js';
import { exec } from 'child_process';

const router = express.Router();

router.get('/incomes', async (req, res) => {
	try {
		const incomes = await Income.find();
		res.status(200).json(incomes);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

router.post('/incomes', async (req, res) => {
	try {
		const updatedData = req.body;
		const updatedIncome = await Income.create(updatedData);
		console.log("Updated Data: " + JSON.stringify(updatedIncome, null, 2));

		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error update updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after income editing' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Income edited and data updated successfully' });
		});
	} catch (error) {
		console.error('Error editing income:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.put('/incomes/:id', async (req, res) => {
	try {
		const { id } = req.params; 
		const updatedData = req.body;
		console.log("Updated Data: " + JSON.stringify(updatedData, null, 2));

		const updatedIncome = await Income.findByIdAndUpdate(id, updatedData);
		if (!updatedIncome) {
			return res.status(404).json({ message: 'Income not found' });
		}
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error update updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after income editing' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Income edited and data updated successfully' });
		});
	} catch (error) {
		console.error('Error editing income:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.delete('/incomes/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Income.findByIdAndDelete(id);

		if (!result) {
			return res.status(404).json({ message: 'Income not found' });
		}

		// recalculate values based on new incomes and sync with MongoDB
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after income deletion' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Income deleted and data updated successfully' });
		});
	} catch (error) {
		console.error('Error deleting income:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

export default router;
