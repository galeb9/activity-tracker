import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#2a2a2a' },
        secondary: { main: '#ffffff' },
        background: { default: '#eef1f7' },
    },
    shape: {
        borderRadius: 20,
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    }
});

export default theme;