import { WidthFull } from "@mui/icons-material";
import "./i18n/config";
import AppRouter from "./routers/routes";
import "./theme/global.css";

function App() {
  return (
    <div className="App" sx={{ WidthFull }}>
      <AppRouter />
    </div>
  );
}

export default App;
