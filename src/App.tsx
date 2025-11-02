import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './AppRoutes';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
