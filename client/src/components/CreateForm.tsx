import { Box, Typography, useTheme, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import FlexBetween from './FlexBetween';

type Props = {
	onSubmit: (formData: {
		date: string;
		amount: number;
		category: string;
	}) => void;
	title: string;
	subtitle?: string;
	initialValues?: { date: string; amount: number; category: string };
};

const CreateForm = ({ onSubmit, title, subtitle, initialValues }: Props) => {
	const { palette } = useTheme();
	const [formData, setFormData] = useState(
		initialValues || { date: '', amount: 0, category: '' }
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // prevent form from refreshing the page
		onSubmit({
			...formData,
			amount: Number(formData.amount), // Ensure amount is a number
		});
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			p={3}
			sx={{
				backgroundColor: palette.background.light,
				borderRadius: 2,
				boxShadow: 3,
			}}
		>
			<Box mb={3}>
				<Typography variant="h4" color={palette.grey[200]}>
					{title}
				</Typography>
				{subtitle && (
					<Typography variant="h6" color={palette.grey[400]}>
						{subtitle}
					</Typography>
				)}
			</Box>
			<Box display="flex" flexDirection="column" gap="1rem">
				<TextField
					label="Date"
					name="date"
					value={formData.date}
					onChange={handleChange}
					fullWidth
					variant="outlined"
					type="date"
					InputLabelProps={{
						shrink: true,
						style: { color: palette.grey[200] },
					}}
                    sx={{
						input: { color: palette.grey[200] },
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: palette.grey[200] , 
							},
						},
					}}
				/>
				<TextField
					label="Amount"
					name="amount"
					value={formData.amount}
					onChange={handleChange}
					fullWidth
					variant="outlined"
					type="number"
					InputLabelProps={{
						shrink: true,
						style: { color: palette.grey[200] },
					}}
                    sx={{
						input: { color: palette.grey[200] },
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: palette.grey[200] , 
							},
						},
					}}
				/>
				<TextField
					label="Category"
					name="category"
					value={formData.category}
					onChange={handleChange}
					fullWidth
					variant="outlined"
					InputLabelProps={{
						shrink: true,
						style: { color: palette.grey[200] },
					}}
                    sx={{
						input: { color: palette.grey[200] },
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: palette.grey[200] , 
							},
						},
					}}
				/>
			</Box>

			<FlexBetween mt={3}>
				<Button type="submit" variant="contained" color="primary">
					Create Form
				</Button>
			</FlexBetween>
		</Box>
	);
};

export default CreateForm;
