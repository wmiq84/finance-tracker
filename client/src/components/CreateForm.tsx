import {
	Box,
	Typography,
	useTheme,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material';
import React, { useState } from 'react';
import FlexBetween from './FlexBetween';

type Props = {
	onSubmit: (formData: {
		date?: string;
		amount?: number;
		category?: string;
		type: string;
		name?: string;
		dueDate?: string;
		amountSaved?: number;
		completed?: boolean;
	}) => void;
	title: string;
	subtitle?: string;
	initialValues?: {
		date?: string;
		amount?: number;
		category?: string;
		type: string;
		name?: string;
		dueDate?: string;
		amountSaved?: number;
		completed?: boolean;
	};
};

const CreateForm = ({ onSubmit, title, subtitle, initialValues }: Props) => {
	const { palette } = useTheme();
	const [formData, setFormData] = useState(
		initialValues || {
			date: '',
			amount: 0,
			category: 'Other',
			type: 'Income',
			name: '',
			dueDate: '',
			amountSaved: 0,  // Default amountSaved to 0
			completed: false, // Default completed to false
		}
	);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit({
			...formData,
			amount: Number(formData.amount),
			amountSaved: Number(formData.amountSaved),
			completed: formData.completed || false, // Default completed to false
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
				<FormControl fullWidth variant="outlined">
					<InputLabel sx={{ color: palette.grey[200] }}>Type</InputLabel>
					<Select
						label="Type"
						name="type"
						value={formData.type}
						onChange={handleChange}
						sx={{
							color: palette.grey[200],
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: palette.grey[200],
							},
							'& .MuiSvgIcon-root': {
								color: palette.grey[200],
							},
						}}
					>
						<MenuItem value="Income">Income</MenuItem>
						<MenuItem value="Spending">Spending</MenuItem>
						<MenuItem value="Goal">Goal</MenuItem>
						<MenuItem value="Budget">Budget</MenuItem>
					</Select>
				</FormControl>

				{formData.type === 'Income' || formData.type === 'Spending' ? (
					<>
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
										borderColor: palette.grey[200],
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
										borderColor: palette.grey[200] },
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
										borderColor: palette.grey[200],
									},
								},
							}}
						/>
					</>
				) : (
					<>
						<TextField
							label="Name"
							name="name"
							value={formData.name}
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
										borderColor: palette.grey[200] },
								},
							}}
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
								style: { color: palette.grey[200] },
							}}
							sx={{
								input: { color: palette.grey[200] },
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: palette.grey[200] },
								},
							}}
						/>

						<TextField
							label="Target Amount"
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
										borderColor: palette.grey[200] },
								},
							}}
						/>

						<TextField
							label="Amount Saved"
							name="amountSaved"
							value={formData.amountSaved}
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
										borderColor: palette.grey[200] },
								},
							}}
						/>
					</>
				)}
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
