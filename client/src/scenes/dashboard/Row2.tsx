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
import { useMemo } from 'react';
import React from 'react';

type Props = {};

const Row2 = (props: Props) => {
	const { palette } = useTheme();
	const { data, refetch: refetchKpis } = useGetKpisQuery();
	const { data: spendingData, refetch: refetchSpendings } = useGetSpendingsQuery();
	const { data: goalData } = useGetGoalsQuery();


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
					<DeleteIcon
						style={{ cursor: 'pointer' }}
						onClick={() => handleDelete(params.id)}
					/>
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
				const updatedIncomeData = await refetchSpendings();
				console.log('Updated Income Data:', updatedIncomeData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
			}
		} catch (error) {
			console.error('Failed to delete income:', error);
		}
	};

	return (
		<>
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
			<DashboardBox gridArea="e"></DashboardBox>
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
