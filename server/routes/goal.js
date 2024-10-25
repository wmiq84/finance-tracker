import express from 'express';
import Goal from '../models/Goal.js';
import { exec } from 'child_process';

const router = express.Router();

router.get('/goals', async (req, res) => {
	try {
		const goals = await Goal.find();
		res.status(200).json(goals);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

router.post('/goals', async (req, res) => {
	try {
		const updatedData = req.body;
		const updatedGoal = await Goal.create(updatedData);
		console.log("Updated Data: " + JSON.stringify(updatedGoal, null, 2));

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
				.json({ message: 'Goal edited and data updated successfully' });
		});
	} catch (error) {
		console.error('Error editing goal:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});


router.put('/goals/:id', async (req, res) => {
	try {
		const { id } = req.params; 
		const updatedData = req.body;
		console.log("Updated Data: " + JSON.stringify(updatedData, null, 2));

		const updatedGoal = await Goal.findByIdAndUpdate(id, updatedData);
		if (!updatedGoal) {
			return res.status(404).json({ message: 'Goal not found' });
		}
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error update updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after goal editing' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Goal edited and data updated successfully' });
		});
	} catch (error) {
		console.error('Error editing goal:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.delete('/goals/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Goal.findByIdAndDelete(id);

		if (!result) {
			return res.status(404).json({ message: 'Goal not found' });
		}

		// recalculate values based on new goals and sync with MongoDB
		console.log('Starting exec command...');
		exec('node ./data/updateData.js', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing updateData.js: ${error.message}`);
				return res
					.status(500)
					.json({ message: 'Error updating data after goal deletion' });
			}

			console.log(`stdout: ${stdout}`);
			return res
				.status(200)
				.json({ message: 'Goal deleted and data updated successfully' });
		});
	} catch (error) {
		console.error('Error deleting goal:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

export default router;
