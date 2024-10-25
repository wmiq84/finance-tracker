import {
	Box,
	Typography,
	useTheme,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import FlexBetween from './FlexBetween';

type Props = {
	open: boolean;
	onClose: () => void;
	onSubmit: (formData: {
		date?: string;
		amount?: number;
		category?: string;
		title?: string;
		dueDate?: string;
		targetAmount?: number;
		amountSaved?: number;
	}) => void;
	title: string;
	subtitle?: string;
	sideText?: string;
	type: 'Spending' | 'Goal';
	initialValues?: {
		date?: string;
		amount?: number;
		category?: string;
		title?: string;
		dueDate?: string;
		targetAmount?: number;
		amountSaved?: number;
	};
};

const ModalForm = ({
	open,
	onClose,
	onSubmit,
	title,
	subtitle,
	sideText,
	type = 'Spending', // default to 'Spending' if undefined
	initialValues,
}: Props) => {
	const { palette } = useTheme();
	const [formData, setFormData] = useState(
		initialValues || {
			date: '',
			amount: 0,
			category: '',
			title: '',
			dueDate: '',
			amountSaved: 0,
			targetAmount: 0,
		}
	);

	// update form data with initial values when they change
	useEffect(() => {
		setFormData(
			initialValues || {
				date: '',
				amount: 0,
				category: '',
				title: '',
				dueDate: '',
				amountSaved: 0,
				targetAmount: 0,
			}
		);
	}, [initialValues]);

	// modify date to fit form
	useEffect(() => {
		const formattedDate = initialValues?.date
			? new Date(initialValues.date).toISOString().substring(0, 10)
			: '';

		let formattedDueDate = '';
		if (initialValues?.dueDate) {
			const dueDateObj = new Date(initialValues.dueDate);
			dueDateObj.setDate(dueDateObj.getDate() - 1); // Subtract one day
			formattedDueDate = dueDateObj.toISOString().substring(0, 10);
		}

		setFormData({
			...initialValues,
			date: formattedDate,
			dueDate: formattedDueDate,
		});
	}, [initialValues]);

	// update form fields on user input
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// handle form submission
	const handleSubmit = () => {
		// ensure correct field names depending on the type
		const submitData = {
			...formData,
			amount:
				type === 'Spending'
					? parseInt(formData.amount as any) * 100
					: undefined,
			targetAmount:
				type === 'Goal'
					? parseInt(formData.targetAmount as any) * 100
					: undefined,
		};
		onSubmit(submitData);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ backgroundColor: palette.grey[700] }}>
				<FlexBetween>
					<Box>
						<Typography variant="h4" mb="-0.1rem" color={palette.grey[200]}>
							{title}
						</Typography>
						<Typography variant="h6" color={palette.grey[200]}>
							{subtitle}
						</Typography>
					</Box>
					<Typography variant="h5" fontWeight="700" color={palette.grey[300]}>
						{sideText}
					</Typography>
				</FlexBetween>
			</DialogTitle>
			<DialogContent sx={{ backgroundColor: palette.grey[400] }}>
				<Box display="flex" flexDirection="column" gap="1rem" mt="1rem">
					{type === 'Spending' && (
						<>
							<TextField
								label="Date"
								name="date"
								value={formData.date}
								onChange={handleChange}
								fullWidth
								variant="outlined"
							/>
							<TextField
								label="Amount"
								name="amount"
								value={formData.amount}
								onChange={handleChange}
								fullWidth
								variant="outlined"
							/>
							<TextField
								label="Category"
								name="category"
								value={formData.category}
								onChange={handleChange}
								fullWidth
								variant="outlined"
							/>
						</>
					)}

					{type === 'Goal' && (
						<>
							<TextField
								label="Title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								fullWidth
								variant="outlined"
							/>
							<TextField
								label="Target Amount"
								name="targetAmount"
								value={formData.targetAmount}
								onChange={handleChange}
								fullWidth
								variant="outlined"
								type="number"
							/>
							<TextField
								label="Amount Saved"
								name="amountSaved"
								value={formData.amountSaved}
								onChange={handleChange}
								fullWidth
								variant="outlined"
								type="number"
							/>
							<TextField
								label="Due Date"
								name="dueDate"
								value={formData.dueDate}
								onChange={handleChange}
								fullWidth
								variant="outlined"
								type="date"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</>
					)}
				</Box>
			</DialogContent>
			<DialogActions sx={{ backgroundColor: palette.grey[400] }}>
				<Button onClick={onClose} sx={{ color: palette.grey[800] }}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary" variant="contained">
					Save Changes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ModalForm;
