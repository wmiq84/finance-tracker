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
import React, { useState } from 'react';
import FlexBetween from './FlexBetween';

type Props = {
	open: boolean;
	onClose: () => void;
	onSubmit: (formData: {
		date: string;
		amount: string;
		category: string;
	}) => void;
	icon?: React.ReactNode;
	title: string;
	subtitle?: string;
	sideText?: string;
	initialValues?: { date: string; amount: string; category: string };
};

const ModalForm = ({
	open,
	onClose,
	onSubmit,
	icon,
	title,
	subtitle,
	sideText,
	initialValues,
}: Props) => {
	const { palette } = useTheme();
	const [formData, setFormData] = useState(
		initialValues || { date: '', amount: '', category: '' }
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = () => {
		onSubmit(formData);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ backgroundColor: palette.grey[700] }}>
				<FlexBetween>
					{icon}
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
