import DashboardBox from '@/components/DashboardBox';
import { useTheme } from '@emotion/react';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import {
	useGetKpisQuery,
	useGetIncomesQuery,
	useGetSpendingsQuery,
	useGetBudgetsQuery,
} from '@/state/api';
import BoxHeader from '@/components/BoxHeader';
import FlexBetween from '@/components/FlexBetween';
import { Box, LinearProgress, Typography } from '@mui/material';

const pieData = [
	{ name: 'Group A', value: 600 },
	{ name: 'Group B', value: 400 },
];

const Row3 = () => {
	const { palette } = useTheme();
	const pieColors = [palette.primary[800], palette.primary[300]];
	const { data } = useGetKpisQuery();
	const { data: incomeData } = useGetIncomesQuery();
	const { data: spendingData } = useGetSpendingsQuery();
	const { data: budgetData } = useGetBudgetsQuery();
	console.log('Budget data: ', budgetData);
	const budgetCardData = useMemo(() => {

		if (budgetData) {
			return budgetData.map(
				({ title, amountSpent, targetAmount, dueDate, completed }) => {
					const progress = (amountSpent / targetAmount) * 100;
					return {
						title,
						amountSpent,
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
	}, [budgetData]);

	const pieChartDataIncome = useMemo(() => {
		if (data) {
			const totalIncome = data[0].totalIncome;
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
			const totalSpending = data[0].totalSpending;
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
								<Typography
									variant="h5"
									sx={{ fontSize: 16, color: palette.grey[200] }}
								>
									Due: {budgetData.dueDate}
								</Typography>
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
						/>{' '}
						<FlexBetween mt="0.25rem">
							<Typography>${budgetData.amountSpent}</Typography>
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
