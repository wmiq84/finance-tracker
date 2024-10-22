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
		date: string;
		amount: number;
		category: string;
	}) => void;
	title: string;
	subtitle?: string;
	sideText?: string;
	initialValues?: { date: string; amount: number; category: string };
};

// receives props
const ModalForm = ({
	open,
	onClose,
	onSubmit,
	title,
	subtitle,
	sideText,
	initialValues,
}: Props) => {
	const { palette } = useTheme();
	const [formData, setFormData] = useState(
		initialValues || { date: '', amount: 0, category: '' }
	);

  // immediately updates form with initial values
	useEffect(() => {
		setFormData(initialValues); 
	}, [initialValues]);

  // updates form when typing
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

  // calls handleEdit with selected id
	const handleSubmit = () => {
    // converts amount to cents for later calculations
		onSubmit({formData,
      amount: parseInt(formData.amount) * 100
    });
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
