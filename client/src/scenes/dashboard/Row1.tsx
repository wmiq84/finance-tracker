import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import {
	useGetKpisQuery,
	useGetIncomesQuery,
	useGetSpendingsQuery,
} from '@/state/api';
import {
	Experimental_CssVarsProvider,
	useTheme,
	Box,
	Hidden,
} from '@mui/material';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { useMemo, useState, useEffect } from 'react';
import {
	ResponsiveContainer,
	AreaChart,
	XAxis,
	YAxis,
	Tooltip,
	Area,
} from 'recharts';
import FlexBetween from '@/components/FlexBetween';
import ModalForm from '@/components/ModalForm';

type Props = {};

const Row1 = (props: Props) => {
	const { palette } = useTheme();
	const { data, refetch: refetchKpis } = useGetKpisQuery();
	const { data: incomeData, refetch: refetchIncomes } = useGetIncomesQuery();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedIncome, setSelectedIncome] = useState(null);

	const handleOpenModal = (income) => {
		setSelectedIncome(income); // Set selected income data
		setIsModalOpen(true);
	};
	const handleCloseModal = () => setIsModalOpen(false);
	// console.log('incomeData: ', incomeData);
	const incomeColumns = [
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
			field: 'test',
			headerName: '',
			flex: 0.4,
			renderCell: (params: GridCellParams) => {
				const income = params.row;
				return (
					<FlexBetween>
						<DeleteIcon
							style={{ cursor: 'pointer' }}
							onClick={() => handleDelete(params.id)}
						/>
						<EditIcon
							style={{ cursor: 'pointer' }}
							onClick={() => handleOpenModal(income)}
						/>
					</FlexBetween>
				);
			},
		},
	];

	const incomeSpending = data
		? data[0].monthlyData.map(({ month, income, spending }) => ({
				name: month.substring(0, 3),
				income,
				spending,
		  }))
		: [];

	// generate the data for net worth
	const netWorth = data
		? data[0].monthlyData.map(
				({ month, income, spending, runningNetWorth }) => ({
					name: month.substring(0, 3),
					netWorth: runningNetWorth,
				})
		  )
		: [];

	// get min and max of income, spending, and networth for graph domains
	const getIncomeSpendingDomain = () => {
		if (!incomeSpending || incomeSpending.length === 0) return [0, 0];
		const incomes = incomeSpending.map((d) => d.income);
		const spendings = incomeSpending.map((d) => d.spending);
		const min = Math.min(...incomes, ...spendings);
		const max = Math.max(...incomes, ...spendings);
		return [Math.floor(min), Math.ceil(max)];
	};

	const getNetWorthDomain = () => {
		if (!netWorth || netWorth.length === 0) return [0, 0];
		const netWorthValues = netWorth.map((d) => d.netWorth);
		const min = Math.min(...netWorthValues);
		const max = Math.max(...netWorthValues);
		return [Math.floor(min), Math.ceil(max)];
	};

	const handleDelete = async (id) => {
		try {
			console.log(id);
			const response = await fetch(
				`http://localhost:1337/income/incomes/${id}`,
				{
					method: 'DELETE',

					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				console.log('Deleted');
				const updatedIncomeData = await refetchIncomes();
				console.log('Updated Income Data:', updatedIncomeData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
			}
		} catch (error) {
			console.error('Failed to delete income:', error);
		}
	};

	const handleEdit = async (id) => {
		try {
			console.log(id);
			const response = await fetch(
				`http://localhost:1337/income/incomes/${id}`,
				{
					method: 'PUT',

					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				console.log('Deleted');
				const updatedIncomeData = await refetchIncomes();
				console.log('Updated Income Data:', updatedIncomeData.data);
				const updatedKpiData = await refetchKpis();
				console.log('Updated KPI Data:', updatedKpiData.data);
			}
		} catch (error) {
			console.error('Failed to edit income:', error);
		}
	};

	return (
		<>
			<ModalForm
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={console.log("ASD")}
				title="Edit Income"
				subtitle="Update the income details"
				sideText="Edit"
				initialValues={
					selectedIncome
						? {
								amount: selectedIncome.amount,
								description: selectedIncome.category,
						  }
						: { amount: '', description: '' }
				} // Use selected income data
			/>

			<DashboardBox gridArea="a">
				<BoxHeader
					title="Income and Spending"
					subtitle="top line represents income, bottom line represents spending"
					sideText="+4%"
				></BoxHeader>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						width={500}
						height={400}
						data={incomeSpending}
						margin={{
							top: 15,
							right: 25,
							left: -10,
							bottom: 60,
						}}
					>
						<defs>
							<linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={palette.primary[300]}
									stopOpacity={0.5}
								/>
								<stop
									offset="95%"
									stopColor={palette.primary[300]}
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={palette.primary[300]}
									stopOpacity={0.5}
								/>
								<stop
									offset="95%"
									stopColor={palette.primary[300]}
									stopOpacity={0}
								/>
							</linearGradient>{' '}
						</defs>
						<XAxis
							dataKey="name"
							tickLine={false}
							style={{ fontSize: '10px' }}
							stroke={palette.grey[200]}
						/>
						<YAxis
							tickLine={false}
							axisLine={{ strokeWidth: '0' }}
							style={{ fontSize: '10px' }}
							domain={getIncomeSpendingDomain()}
							stroke={palette.grey[200]}
						/>
						<Tooltip />
						<Area
							type="monotone"
							dataKey="income"
							dot={true}
							stroke={palette.primary.main}
							fillOpacity={1}
							fill="url(#colorIncome)"
						/>
						<Area
							type="monotone"
							dataKey="spending"
							dot={true}
							stroke={palette.primary.main}
							fillOpacity={1}
							fill="url(#colorSpending)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</DashboardBox>
			<DashboardBox gridArea="b">
				<BoxHeader title="Net Worth" sideText="+4%"></BoxHeader>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						width={500}
						height={400}
						data={netWorth}
						margin={{
							top: 15,
							right: 25,
							left: -10,
							bottom: 60,
						}}
					>
						<defs>
							<linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={palette.primary[300]}
									stopOpacity={0.5}
								/>
								<stop
									offset="95%"
									stopColor={palette.primary[300]}
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<XAxis
							dataKey="name"
							tickLine={false}
							style={{ fontSize: '10px' }}
							stroke={palette.grey[200]}
						/>
						<YAxis
							tickLine={false}
							axisLine={{ strokeWidth: '0' }}
							style={{ fontSize: '10px' }}
							domain={getNetWorthDomain()}
							stroke={palette.grey[200]}
						/>
						<Tooltip />
						<Area
							type="monotone"
							dataKey="netWorth"
							dot={true}
							stroke={palette.primary.main}
							fillOpacity={1}
							fill="url(#colorNetWorth)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</DashboardBox>
			<DashboardBox gridArea="c">
				<BoxHeader
					title="Recent Incomes"
					sideText={`${incomeData?.length} sources`}
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
						rows={incomeData || []}
						columns={incomeColumns}
					/>
				</Box>
			</DashboardBox>
		</>
	);
};

export default Row1;
