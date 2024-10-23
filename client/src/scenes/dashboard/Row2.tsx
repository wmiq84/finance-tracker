import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import {
	useGetKpisQuery,
	useGetIncomesQuery,
	useGetSpendingsQuery,
	useGetGoalsQuery,
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
	const { data: goalData } = useGetGoalsQuery();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSpending, setselectedSpending] = useState<Spending | null>(
		null
	);
	const { data: incomeData, refetch: refetchIncomes } = useGetIncomesQuery();

	const handleOpenModal = (id) => {
		// sets the selected spending and opens modal
		const spendingToEdit = spendingData?.find(
			(spending: spending) => spending.id === id
		);
		setselectedSpending(spendingToEdit);
		setIsModalOpen(true);
	};
	const handleCloseModal = () => setIsModalOpen(false);

	const goalCardData = useMemo(() => {
		if (goalData) {
			return goalData.map(
				({ title, amountSaved, targetAmount, dueDate, completed }) => {
					const progress = (amountSaved / targetAmount) * 100;
					return {
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
							onClick={() => handleDelete(params.id)}
						/>
						<EditIcon
							style={{ cursor: 'pointer' }}
							onClick={() => handleOpenModal(params.id)}
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

	const handleDelete = async (id) => {
		try {
			console.log(id);
			const response = await fetch(
				`http://localhost:1337/spending/spendings/${id}`,
				{
					method: 'DELETE',

					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				console.log('Deleted');
				const updatedspendingData = await refetchSpendings();
				console.log('Updated Spending Data:', updatedspendingData.data);
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
				const updatedspendingData = await refetchSpendings();
				console.log('Updated Spending Data:', updatedspendingData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
				handleCloseModal();
			}
		} catch (error) {
			console.error('Failed to edit spending:', error);
		}
	};

	const handleCreateIncome = async (formData) => {
		// convert amount to cents for future operations
		const modifiedFormData = {
			...formData,
			amount: formData.amount * 100 
		};

		try {
			const response = await fetch(`http://localhost:1337/income/incomes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(modifiedFormData),
			});
	
			if (response.ok) {
				console.log('Income created');
				const updatedIncomeData = await refetchIncomes();
				console.log('Updated Income Data:', updatedIncomeData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
			}
		} catch (error) {
			console.error('Failed to create income:', error);
		}
	};	

	return (
		<>
			<ModalForm
				// passes various props to ModalForm.tsx
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={(formData) => handleEdit(selectedSpending?.id, formData)} // pass a function that uses selectedSpending.id
				title="Edit Spending"
				subtitle="Update the spending details"
				sideText="Edit"
				initialValues={{
					date: selectedSpending?.date || '',
					amount: selectedSpending?.amount || '',
					category: selectedSpending?.category || '',
				}}
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
								<Typography
									variant="h5"
									sx={{ fontSize: 16, color: palette.grey[200] }}
								>
									Due: {goalData.dueDate}
								</Typography>
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
					// open={isFormOpen}
					// onClose={handleCloseForm}
					onSubmit={handleCreateIncome}
					title="Create New Income"
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
