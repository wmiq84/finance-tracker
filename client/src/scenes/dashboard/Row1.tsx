import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import {
	useGetKpisQuery,
	useGetProductsQuery,
	useGetTransactionsQuery,
} from '@/state/api';
import {
	Experimental_CssVarsProvider,
	useTheme,
	Box,
	Hidden,
} from '@mui/material';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { useMemo } from 'react';
import React from 'react';
import {
	ResponsiveContainer,
	AreaChart,
	XAxis,
	YAxis,
	Tooltip,
	Area,
} from 'recharts';

type Props = {};

const Row1 = (props: Props) => {
	const { palette } = useTheme();
	const { data } = useGetKpisQuery();
	const { data: productData } = useGetProductsQuery();
	const { data: transactionData } = useGetTransactionsQuery();
	// console.log('productData: ', productData);
	// console.log('transactionData: ', transactionData);
	const productColumns = [
		{
			field: '_id',
			headerName: 'id',
			flex: 1,
		},
		{
			field: 'expense',
			headerName: 'Expense',
			flex: 0.5,
			renderCell: (params: GridCellParams) => `$${params.value}`,
		},
		{
			field: 'price',
			headerName: 'Price',
			flex: 0.5,
			renderCell: (params: GridCellParams) => `$${params.value}`,
		},
	];

	const incomeSpending = useMemo(() => {
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
	return (
		<>
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
							domain={[8000, 23000]}
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
			<DashboardBox gridArea="b"></DashboardBox>
			<DashboardBox gridArea="c">
				<BoxHeader
					title="Recent Income"
					sideText={`${productData?.length} products`}
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
						rows={productData || []}
						columns={productColumns}
					/>
				</Box>
			</DashboardBox>
		</>
	);
};

export default Row1;
