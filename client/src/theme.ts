export const tokens = {
	grey: {
		100: '#dfe1e6',
		200: '#bfc2cd',
		300: '#a0a4b3',
		400: '#80859a',
		500: '#606781',
		600: '#4d5267',
		700: '#3a3e4d',
		800: '#262934',
		900: '#13151a',
	},
	primary: {
		// light blue
		100: '#cceeff',
		200: '#99ddff',
		300: '#66ccff',
		400: '#33bbff',
		500: '#00aaff',
		600: '#0088cc',
		700: '#006699',
		800: '#004466',
		900: '#002233',
	},
	secondary: {
		// yellow
		100: '#ffedcc',
		200: '#ffdb99',
		300: '#ffc966',
		400: '#ffb733',
		500: '#ffa500',
		600: '#cc8400',
		700: '#996300',
		800: '#664200',
		900: '#332100',
	},
	tertiary: {
		// steel blue
		500: '#4682b4',
	},
	background: {
		// gunmetal
		light: '#2c2f36',
		// black-blue
		main: '#1c1f25',
	},
};

// mui theme settings
export const themeSettings = {
	palette: {
		primary: {
			...tokens.primary,
			main: tokens.primary[500],
			light: tokens.secondary[400],
		},
		secondary: {
			...tokens.secondary,
			main: tokens.secondary[500],
		},
		tertiary: {
			...tokens.tertiary,
		},
		grey: {
			...tokens.grey,
			main: tokens.grey[500],
		},
		background: {
			default: tokens.background.main,
			light: tokens.background.light,
		},
	},
	typography: {
		fontFamily: ['Helvetica', 'sans-serif'].join(','),
		fontSize: 12,
		h1: {
			fontFamily: ['Helvetica', 'sans-serif'].join(','),
			fontSize: 32,
		},
		h2: {
			fontFamily: ['Helvetica', 'sans-serif'].join(','),
			fontSize: 24,
		},
		h3: {
			fontFamily: ['Helvetica', 'sans-serif'].join(','),
			fontSize: 20,
			fontWeight: 800,
			color: tokens.grey[200],
		},
		h4: {
			fontFamily: ['Helvetica', 'sans-serif'].join(','),
			fontSize: 20,
			fontWeight: 600,
			color: tokens.grey[300],
		},
		h5: {
			fontFamily: ['Helvetica', 'sans-serif'].join(','),
			fontSize: 12,
			fontWeight: 400,
			color: tokens.grey[500],
		},
		h6: {
			fontFamily: ['Helvetica', 'sans-serif'].join(','),
			fontSize: 10,
			color: tokens.grey[700],
		},
	},
};
