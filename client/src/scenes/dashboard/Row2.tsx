import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import {
	useGetKpisQuery,
	useGetIncomesQuery,
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

type Props = {};

const Row2 = (props: Props) => {
	const { palette } = useTheme();
	const { data } = useGetKpisQuery();
	const { data: transactionData } = useGetTransactionsQuery();
	console.log('transactionData: ', transactionData);
	const transactionColumns = [
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
	];

	const transactionSpending = useMemo(() => {
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
			<DashboardBox gridArea="d"></DashboardBox>
			<DashboardBox gridArea="e"></DashboardBox>
			<DashboardBox gridArea="f">
				<BoxHeader
					title="Recent Transactions"
					sideText={`${transactionData?.length} sources`}
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
						rows={transactionData || []}
						columns={transactionColumns}
					/>
				</Box>
			</DashboardBox>
		</>
	);
};

export default Row2;
