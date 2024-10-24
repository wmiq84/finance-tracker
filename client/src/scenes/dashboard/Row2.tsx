import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import {
	useGetKpisQuery,
	useGetIncomesQuery,
	useGetSpendingsQuery,
	useGetGoalsQuery,
	useGetBudgetsQuery,
} from '@/state/api';
import {
	Experimental_CssVarsProvider,
	useTheme,
	Box,
	Hidden,
	Card,
	LinearProgress,
	Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { useMemo, useState, useEffect } from 'react';
import ModalForm from '@/components/ModalForm';
import CreateForm from '@/components/CreateForm';

type Props = {};

const Row2 = (props: Props) => {
	const { palette } = useTheme();
	const { data, refetch: refetchKpis } = useGetKpisQuery();
	const { data: spendingData, refetch: refetchSpendings } =
		useGetSpendingsQuery();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSpending, setselectedSpending] = useState<Spending | null>(
		null
	);
	const [selectedGoal, setSelectedGoal] = useState<Goal | null>(
		null
	);
	const { data: incomeData, refetch: refetchIncomes } = useGetIncomesQuery();
	const { data: goalData, refetch: refetchGoals } = useGetGoalsQuery();
	const { data: budgetData, refetch: refetchBudgets } = useGetBudgetsQuery();

	const handleOpenModal = (id, type) => {
		if (type === 'Spending') {
		  const spendingToEdit = spendingData?.find(
			(spending) => spending.id === id
		  );
		  setselectedSpending(spendingToEdit);
		} else if (type === 'Goal') {
		  const goalToEdit = goalData?.find(
			(goal) => goal.id === id
		  );
		  setSelectedGoal(goalToEdit); 
		}
	  
		setIsModalOpen(true);
	  };
	  
	  const handleCloseModal = () => {
		setIsModalOpen(false);
		setselectedSpending(null);  
		setSelectedGoal(null);  
	  };
	  

	const goalCardData = useMemo(() => {
		if (goalData) {
			return goalData.map(
				({ id, title, amountSaved, targetAmount, dueDate, completed }) => {
					const progress = (amountSaved / targetAmount) * 100;
					return {
						id,
						title,
						amountSaved,
						targetAmount,
						dueDate: new Date(dueDate).toLocaleDateString('en-US', {
							year: 'numeric',
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
	}, [goalData]);

	const spendingColumns = [
		{
			field: 'date',
			headerName: 'Date',
			flex: 1,
			renderCell: (params: GridCellParams) => {
				const date = new Date(params.value);
				date.setDate(date.getDate() + 1);
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
				});
			},
		},
		{
			field: 'amount',
			headerName: 'Amount',
			flex: 1,
			renderCell: (params: GridCellParams) => `$${params.value}`,
		},
		{
			field: 'category',
			headerName: 'Category',
			flex: 1,
		},
		{
			field: 'delete',
			headerName: '',
			flex: 0.4,
			renderCell: (params: GridCellParams) => {
				return (
					<FlexBetween>
						<DeleteIcon
							style={{ cursor: 'pointer' }}
							onClick={() => handleDelete(params.id, 'Spending')}
						/>
						<EditIcon
							style={{ cursor: 'pointer' }}
							onClick={() => handleOpenModal(params.id, 'Spending')}
						/>
					</FlexBetween>
				);
			},
		},
	];

	const spendingSpending = useMemo(() => {
		return (
			data &&
			data[0].monthlyData.map(({ month, income, spending }) => {
				return {
					name: month.substring(0, 3),
					income: income,
					spending: spending,
				};
			})
		);
	}, [data]);

	const handleDelete = async (id, type) => {
		try {
			let endpoint = '';

			switch (type) {
				case 'Spending':
					endpoint = `http://localhost:1337/spending/spendings/${id}`;
					break;
				case 'Goal':
					console.log(id);
					endpoint = `http://localhost:1337/goal/goals/${id}`;
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
				const updatedGoalData = await refetchGoals();
				console.log('Updated Goal Data:', updatedGoalData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
			}
		} catch (error) {
			console.error('Failed to delete spending:', error);
		}
	};

	const handleEdit = async (id, formData) => {
		console.log(JSON.stringify(formData));
		if (!id) {
			console.error('No ID provided for the selected spending.');
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:1337/spending/spendings/${id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);

			if (response.ok) {
				console.log('Spending edited');
				const updatedSpendingData = await refetchSpendings();
				console.log('Updated Spending Data:', updatedSpendingData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
				handleCloseModal();
			}
		} catch (error) {
			console.error('Failed to edit spending:', error);
		}
	};

	const handleCreate = async (formData) => {
		// convert amount to cents for future operations
		const modifiedFormData = {
			...formData,
			amount: formData.amount * 100,
		};

		try {
			let endpoint = '';

			switch (formData.type) {
				case 'Income':
					endpoint = 'http://localhost:1337/income/incomes';
					break;
				case 'Spending':
					endpoint = 'http://localhost:1337/spending/spendings';
					break;
				case 'Goal':
					endpoint = 'http://localhost:1337/goal/goals';
					break;
				case 'Budget':
					endpoint = 'http://localhost:1337/budget/budgets';
					break;
				default:
					throw new Error('Invalid form type');
			}

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(modifiedFormData),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to create ${formData.type}: ${response.statusText}`
				);
			}

			console.log(`${formData.type} created successfully`);

			switch (formData.type) {
				case 'Income': {
					const updatedIncomeData = await refetchIncomes();
					console.log('Updated Income Data:', updatedIncomeData.data);
					break;
				}
				case 'Spending': {
					const updatedSpendingData = await refetchSpendings();
					console.log('Updated Spending Data:', updatedSpendingData.data);
					break;
				}
				case 'Goal': {
					const updatedGoalData = await refetchGoals();
					console.log('Updated Goal Data:', updatedGoalData.data);
					break;
				}
				case 'Budget': {
					const updatedBudgetData = await refetchBudgets();
					console.log('Updated Budget Data:', updatedBudgetData.data);
					break;
				}
				default:
					break;
			}
			const updatedKpiData = await refetchKpis();
			console.log('Updated KPI Data:', updatedKpiData.data);
		} catch (error) {
			console.error(`Error while creating ${formData.type}:`, error);
		}
	};

	return (
		<>
			<ModalForm
				// passes various props to ModalForm.tsx
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={(formData) =>
					selectedSpending
					  ? handleEdit(selectedSpending?.id, formData)  
					  : handleEdit(selectedGoal?.id, formData)    
				  }
				title={selectedSpending ? 'Edit Spending' : 'Edit Goal'}
				subtitle={`Update the ${
					selectedSpending ? 'spending' : 'goal'
				} details`}
				sideText="Edit"
				type={selectedSpending ? 'Spending' : 'Goal'}
				initialValues={
					selectedSpending
						? {
								date: selectedSpending?.date || '',
								amount: selectedSpending?.amount || '',
								category: selectedSpending?.category || 'Other',
						  }
						: {
								title: selectedGoal?.title || '',
								targetAmount: selectedGoal?.targetAmount || 0,
								amountSaved: selectedGoal?.amountSaved || 0,
								dueDate: selectedGoal?.dueDate || '',
						  }
				}
			/>
			<DashboardBox gridArea="d">
				<BoxHeader title="Goals"></BoxHeader>
				{goalCardData?.map((goalData, i) => (
					<Box mt="0.5rem" p="0 1rem" key={`${goalData.title}`}>
						<FlexBetween mb="0.25rem">
							<Typography
								variant="h5"
								sx={{ fontSize: 16, color: palette.grey[200] }}
							>{`${goalData.title}`}</Typography>
							{goalData.completed ? (
								<Typography
									variant="h5"
									sx={{ fontSize: 16, color: palette.grey[200] }}
								>
									completed
								</Typography>
							) : (
								<Box display="flex" alignItems="center" gap="0.5rem">
									{' '}
									<Typography
										variant="h5"
										sx={{ fontSize: 16, color: palette.grey[200] }}
									>
										Due: {goalData.dueDate}
									</Typography>
									<Box mb="-.2rem">
										<DeleteIcon
											style={{ cursor: 'pointer' }}
											onClick={() => handleDelete(goalData.id, 'Goal')}
										/>
										<EditIcon
											style={{ cursor: 'pointer' }}
											onClick={() => handleOpenModal(goalData.id, 'Goal')}
										/>
									</Box>
								</Box>
							)}
						</FlexBetween>
						<LinearProgress
							variant="determinate"
							value={goalData.progress}
							sx={{
								height: 10,
								borderRadius: 5,
								backgroundColor: palette.grey[700],
								'& .MuiLinearProgress-bar': {
									borderRadius: 5,
								},
							}}
						/>{' '}
						<FlexBetween mt="0.25rem">
							<Typography>${goalData.amountSaved}</Typography>
							<Typography>${goalData.targetAmount}</Typography>
						</FlexBetween>
					</Box>
				))}
			</DashboardBox>
			<DashboardBox gridArea="e">
				<CreateForm
					onSubmit={handleCreate}
					title="Add New Income, Spending, Goal, Or Budget"
				></CreateForm>
			</DashboardBox>
			<DashboardBox gridArea="f">
				<BoxHeader
					title="Recent Spending"
					sideText={`${spendingData?.length} sources`}
				></BoxHeader>
				<Box
					mt="0.5rem"
					p="0 0.5rem"
					height="75%"
					sx={{
						'& .MuiDataGrid-root': {
							color: palette.grey[200],
							border: 'none',
						},
						'& .MuiDataGrid-cell': {
							borderBottom: `1px solid ${palette.grey[800]} !important`,
						},
						'& .MuiDataGrid-columnHeaders': {
							borderBottom: `1px solid ${palette.grey[800]} !important`,
						},
						'& .MuiDataGrid-columnSeparator': {
							visibility: 'hidden',
						},
					}}
				>
					<DataGrid
						columnHeaderHeight={25}
						rowHeight={35}
						hideFooter={true}
						rows={spendingData || []}
						columns={spendingColumns}
					/>
				</Box>
			</DashboardBox>
		</>
	);
};

export default Row2;
