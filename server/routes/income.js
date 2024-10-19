import express from 'express';
import Income from '../models/Income.js';
import { exec } from 'child_process';
import path from 'path';

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

		// recalculate values based on new incomes and sync with mongoDB
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing updateData.js: ${error.message}`);
				return res.status(500).json({ message: 'Failed to update data' });
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
				return res.status(500).json({ message: 'Data updated with some issues' });
			}

			console.log(`stdout: ${stdout}`);
			return res.status(200).json({ message: 'Income deleted and data updated successfully' });
		});

	} catch (error) {
		console.error('Error deleting income:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

export default router;
