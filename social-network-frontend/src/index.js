import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import UserInfoProvider from "./provider/useInfoContext";
import CssBaseline from "@mui/material/CssBaseline";
import appTheme from "./theme/appTheme";
import { BrowserRouter } from "react-router-dom";
import AppMessagePopup from "./components/App/MessagePopup";
import { Provider } from "react-redux";
import { store } from "./store/config";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <AppMessagePopup />
        <UserInfoProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserInfoProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
