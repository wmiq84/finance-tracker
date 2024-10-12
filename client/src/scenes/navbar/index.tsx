import { useState } from 'react';
import FlexBetween from '@/components/FlexBetween';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {};

const Navbar = (props: Props) => {
	const { palette } = useTheme();
	const [selected, setSelected] = useState('dashboard');
	return (
		<FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
			{/* Left side of navbar */}
			<FlexBetween gap="0.75rem">
				<AttachMoneyIcon sx={{ fontSize: '28px' }}></AttachMoneyIcon>
				<Typography variant="h4" fontSize="16px" color={palette.grey[200]}>
					Finance Dashboard
				</Typography>
			</FlexBetween>
			{/* Right side of navbar */}
			<FlexBetween gap="2rem">
				<Box
					color={palette.grey[200]}
					sx={{ '&:hover': { color: palette.primary[100] } }}
				>
					<Link
						to="/"
						onClick={() => setSelected('dashboard')}
						style={{
							color: selected === 'dashboard' ? 'inherit' : palette.grey[700],
							textDecoration: 'inherit',
						}}
					>
						Dashboard
					</Link>
				</Box>
				<Box
					color={palette.grey[200]}
					sx={{ '&:hover': { color: palette.primary[100] } }}
				>
					<Link
						to="/predictions"
						onClick={() => setSelected('predictions')}
						style={{
							color: selected === 'predictions' ? 'inherit' : palette.grey[700],
							textDecoration: 'inherit',
						}}
					>
						Predictions
					</Link>
				</Box>
			</FlexBetween>
		</FlexBetween>
	);
};

export default Navbar;
