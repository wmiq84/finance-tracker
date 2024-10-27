import DashboardBox from '@/components/DashboardBox';
import { useTheme } from '@emotion/react';
import React, { useMemo, useState, useEffect } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import {
	useGetKpisQuery,
	useGetIncomesQuery,
	useGetSpendingsQuery,
	useGetBudgetsQuery,
	useGetGoalsQuery,
} from '@/state/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BoxHeader from '@/components/BoxHeader';
import FlexBetween from '@/components/FlexBetween';
import { Box, LinearProgress, Typography } from '@mui/material';
import ModalForm from '@/components/ModalForm';
import CreateForm from '@/components/CreateForm';

const pieData = [
	{ name: 'Group A', value: 600 },
	{ name: 'Group B', value: 400 },
];

const Row3 = () => {
	const { palette } = useTheme();
	const { data, refetch: refetchKpis } = useGetKpisQuery();
	const { data: spendingData, refetch: refetchSpendings } =
		useGetSpendingsQuery();
	const pieColors = [palette.primary[800], palette.primary[300]];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSpending, setselectedSpending] = useState<Spending | null>(
		null
	);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
	const { data: incomeData, refetch: refetchIncomes } = useGetIncomesQuery();
	const { data: goalData, refetch: refetchGoals } = useGetGoalsQuery();
	const { data: budgetData, refetch: refetchBudgets } = useGetBudgetsQuery();

	const budgetCardData = useMemo(() => {
		if (budgetData) {
			return budgetData.map(
				({ id, title, amountSaved, targetAmount, dueDate, completed }) => {
					const progress = (amountSaved / targetAmount) * 100;
					return {
						id,
						title,
						amountSaved,
						targetAmount,
						dueDate: new Date(dueDate).toLocaleDateString('en-US', {
							month: '2-digit',
							day: '2-digit',
						}),
						completed,
						progress,
					};
				}
			);
		}
		return [];
	}, [budgetData]);

	const handleOpenModal = (id, type) => {
		if (type === 'Spending') {
			const spendingToEdit = spendingData?.find(
				(spending) => spending.id === id
			);
			setselectedSpending(spendingToEdit);
		} else if (type === 'Goal') {
			const budgetToEdit = budgetData?.find((budget) => budget.id === id);
			setSelectedBudget(budgetToEdit);
		}

		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setselectedSpending(null);
		setSelectedBudget(null);
	};

	const handleDelete = async (id, type) => {
		try {
			let endpoint = '';

			switch (type) {
				case 'Spending':
					endpoint = `${import.meta.env.VITE_API_URL}/spending/spendings/${id}`;
					break;
				case 'Goal':
					console.log(id);
					endpoint = `${import.meta.env.VITE_API_URL}/budget/budgets/${id}`;
					break;
				default:
					throw new Error('Invalid delete type');
			}

			const response = await fetch(endpoint, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				console.log('Deleted');
				const updatedspendingData = await refetchSpendings();
				console.log('Updated Spending Data:', updatedspendingData.data);
				const updatedGoalData = await refetchBudgets();
				console.log('Updated Goal Data:', updatedGoalData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
			}
		} catch (error) {
			console.error('Failed to delete spending:', error);
		}
	};

	const handleEdit = async (id, type, formData) => {
		const modifiedFormData = {
			...formData,
			amountSaved: formData.amountSaved * 100,
			dueDate: (() => {
				const date = new Date(formData.dueDate);
				date.setDate(date.getDate() + 1);
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${month}/${day}`; 
			})(),	
		};

		console.log(modifiedFormData)

		try {
			let endpoint = '';

			switch (type) {
				case 'Spending':
					endpoint = `${import.meta.env.VITE_API_URL}/spending/spendings/${id}`;
					break;
				case 'Goal':
					endpoint = `${import.meta.env.VITE_API_URL}/budget/budgets/${id}`;
					break;
				default:
					throw new Error('Invalid form type');
			}

			const response = await fetch(endpoint, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(modifiedFormData),
			});

			if (response.ok) {
				console.log(`${type} edited successfully`);
				if (type === 'Spending') {
					await refetchSpendings();
				} else if (type === 'Goal') {
					await refetchBudgets();
				}

				await refetchKpis();
				handleCloseModal();
			} else {
				console.error(`Failed to edit ${type}:`, response.statusText);
			}
		} catch (error) {
			console.error(`Failed to edit ${type}:`, error);
		}
	};

	const pieChartDataIncome = useMemo(() => {
		if (data) {
			const totalIncome = data[0].totalIncome * 100;
			return (
				Object.entries(data[0].incomeByCategory)
					// filter out invalid and null values
					.filter(([key, value]) => key !== '$*' && value !== null)
					.map(([key, value]) => {
						return [
							{
								name: key,
								value: value,
							},
							{
								name: `${key} of Total`,
								value: totalIncome - value,
							},
						];
					})
			);
		}
	}, [data]);

	const pieChartDataSpending = useMemo(() => {
		if (data) {
			const totalSpending = data[0].totalSpending * 100;

			// Check and log the structure of spendingByCategory
			return (
				Object.entries(data[0].spendingByCategory)
					// filter out invalid and null values
					.filter(([key, value]) => key !== '$*' && value !== null)
					.map(([key, value]) => {
						return [
							{
								name: key,
								value: value,
							},
							{
								name: `${key} of Total`,
								value: totalSpending - value,
							},
						];
					})
			);
		}
	}, [data]);

	return (
		<>
			<ModalForm
				// passes various props to ModalForm.tsx
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={(formData) => {
					if (selectedSpending) {
						handleEdit(selectedSpending?.id, 'Spending', formData);
					} else if (selectedBudget) {
						handleEdit(selectedBudget?.id, 'Goal', formData);
					}
				}}
				title={selectedSpending ? 'Edit Spending' : 'Edit Budget'}
				subtitle={`Update the ${
					selectedSpending ? 'spending' : 'budget'
				} details`}
				sideText="Edit"
				type={selectedSpending ? 'Spending' : 'Goal'}
				initialValues={
					selectedSpending
						? {
								date: selectedSpending?.date || '',
								amount: selectedSpending?.amount || '',
								category: selectedSpending?.category || '',
								title: '',
								targetAmount: 0,
								amountSaved: 0,
								dueDate: '',
						  }
						: {
								title: selectedBudget?.title || '',
								targetAmount: selectedBudget?.targetAmount || 0,
								amountSaved: selectedBudget?.amountSaved || 0,
								dueDate: selectedBudget?.dueDate || '',
								date: '',
								amount: 0,
								category: '',
						  }
				}
			/>
			<DashboardBox gridArea="g">
				<BoxHeader title="Budgets"></BoxHeader>
				{budgetCardData?.map((budgetData, i) => (
					<Box mt="0.5rem" p="0 1rem" key={`${budgetData.title}`}>
						<FlexBetween mb="0.25rem">
							<Typography
								variant="h5"
								sx={{ fontSize: 16, color: palette.grey[200] }}
							>{`${budgetData.title}`}</Typography>
							{budgetData.completed ? (
								<Typography
									variant="h5"
									sx={{ fontSize: 16, color: palette.grey[200] }}
								>
									completed
								</Typography>
							) : (
								<Box display="flex" alignItems="center" gap="0.5rem">
									<Typography
										variant="h5"
										sx={{ fontSize: 16, color: palette.grey[200] }}
									>
										Due: {budgetData.dueDate}
									</Typography>
									<Box mb="-.2rem">
										<DeleteIcon
											style={{ cursor: 'pointer' }}
											onClick={() => handleDelete(budgetData.id, 'Goal')}
										/>
										<EditIcon
											style={{ cursor: 'pointer' }}
											onClick={() => handleOpenModal(budgetData.id, 'Goal')}
										/>
									</Box>
								</Box>
							)}
						</FlexBetween>
						<LinearProgress
							variant="determinate"
							value={budgetData.progress}
							sx={{
								height: 10,
								borderRadius: 5,
								backgroundColor: palette.grey[700],
								'& .MuiLinearProgress-bar': {
									borderRadius: 5,
								},
							}}
						/>
						<FlexBetween mt="0.25rem">
							<Typography>${budgetData.amountSaved}</Typography>
							<Typography>${budgetData.targetAmount}</Typography>
						</FlexBetween>
					</Box>
				))}
			</DashboardBox>
			<DashboardBox gridArea="h">
				<BoxHeader title="Income and Spendings by Category" />
				<FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
					{pieChartDataIncome?.map((data, i) => (
						<Box key={`${data[0].name}-${i}`}>
							<PieChart width={110} height={100}>
								<Pie
									stroke="none"
									data={data}
									innerRadius={18}
									outerRadius={35}
									paddingAngle={2}
									dataKey="value"
								>
									{pieData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={pieColors[index]} />
									))}
								</Pie>
							</PieChart>
							<Typography variant="h5">{data[0].name}</Typography>
						</Box>
					))}
				</FlexBetween>
				<FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
					{pieChartDataSpending?.map((data, i) => (
						<Box key={`${data[0].name}-${i}`}>
							<PieChart width={110} height={100}>
								<Pie
									stroke="none"
									data={data}
									innerRadius={18}
									outerRadius={35}
									paddingAngle={2}
									dataKey="value"
								>
									{pieData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={pieColors[index]} />
									))}
								</Pie>
							</PieChart>
							<Typography variant="h5">{data[0].name}</Typography>
						</Box>
					))}
				</FlexBetween>
			</DashboardBox>
		</>
	);
};

export default Row3;
