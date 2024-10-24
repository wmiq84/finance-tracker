import express from 'express';
import Spending from '../models/Spending.js';
import { exec } from 'child_process';

const router = express.Router();

router.get('/spendings', async (req, res) => {
	try {
		const spendings = await Spending.find().limit(50).sort({ createdOn: -1 });
		res.status(200).json(spendings);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

router.post('/spendings', async (req, res) => {
	try {
		const updatedData = req.body;
		const updatedSpending = await Spending.create(updatedData);
		console.log("Updated Data: " + JSON.stringify(updatedSpending, null, 2));

		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error update updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after spending editing' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Spending edited and data updated successfully' });
		});
	} catch (error) {
		console.error('Error editing spending:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.put('/spendings/:id', async (req, res) => {
	try {
		const { id } = req.params; 
		const updatedData = req.body;
		console.log("Updated Data: " + JSON.stringify(updatedData, null, 2));

		const updatedSpending = await Spending.findByIdAndUpdate(id, updatedData);
		if (!updatedSpending) {
			return res.status(404).json({ message: 'Spending not found' });
		}
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error update updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after spending editing' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Spending edited and data updated successfully' });
		});
	} catch (error) {
		console.error('Error editing spending:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.delete('/spendings/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Spending.findByIdAndDelete(id);

		if (!result) {
			return res.status(404).json({ message: 'Spending not found' });
		}

		// recalculate values based on new spendings and sync with MongoDB
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after spending deletion' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Spending deleted and data updated successfully' });
		});
	} catch (error) {
		console.error('Error deleting spending:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

export default router;
