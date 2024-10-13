import DashboardBox from '@/components/DashboardBox';
import { useTheme } from '@emotion/react';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import {
	useGetKpisQuery,
	useGetIncomesQuery,
	useGetTransactionsQuery,
} from '@/state/api';
import BoxHeader from '@/components/BoxHeader';
import FlexBetween from '@/components/FlexBetween';
import { Box, Typography } from '@mui/material';

const pieData = [
	{ name: 'Group A', value: 600 },
	{ name: 'Group B', value: 400 },
];

const Row3 = () => {
	const { palette } = useTheme();
	const pieColors = [palette.primary[800], palette.primary[300]];
	const { data } = useGetKpisQuery();
	const { data: incomeData } = useGetIncomesQuery();
	const { data: transactionData } = useGetTransactionsQuery();

	const pieChartData = useMemo(() => {
		if (data) {
			const totalSpending = data[0].totalSpending;
			console.log(Object.entries(data[0].spendingByCategory));
			return Object.entries(data[0].spendingByCategory)
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
				});
		}
	}, [data]);

	return (
		<>
			<DashboardBox gridArea="g"></DashboardBox>
			<DashboardBox gridArea="h">
				<BoxHeader title="Income and Transactions by Category" />
				<FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
					{pieChartData?.map((data, i) => (
						<Box key={`${data[0].name}-${i}`}>
							<PieChart
								width={110}
								height={100}
								// margin={{ top: 0, right: -10, left: 10, bottom: 0 }}
							>
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
