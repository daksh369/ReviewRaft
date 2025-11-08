import AppRoutes from './AppRoutes';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
