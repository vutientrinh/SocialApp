import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { parseCookies } from "nookies";
import { CHECK_TOKEN_URL, CHECK_TOKEN_ROLE_ADMIN } from "../Path/backend";
import {
  checkRefreshTokenExpired,
  makeNewAccessTokenToRequest,
} from "./refreshToken";

// Check token before loading a general page (e.g., Main Page, Profile Page)
export const checkTokenBeforeLoadPage = async (navigate: NavigateFunction) => {
  try {
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];

    await axios.post(CHECK_TOKEN_URL, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { props: {} };
  } catch (error) {
    return checkRefreshTokenExpired(navigate);
  }
};

// Check token before loading admin pages (e.g., Dashboard)
export const checkTokenBeforeLoadAdminPage = async (
  navigate: NavigateFunction
) => {
  try {
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];

    await axios.post(CHECK_TOKEN_ROLE_ADMIN, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // navigate("/admin/dashboard", { replace: true });
    navigate("/", { replace: true });
  } catch (error) {
    if (!error.response) {
      navigate("/505", { replace: true });
      return;
    }

    if (error.response.status === 401) {
      await makeNewAccessTokenToRequest(error, navigate);
    }

    if (error.response.status === 403) {
      navigate("/", { replace: true });
      return;
    }

    navigate("/auth/login", { replace: true });
  }
};

// Check token before loading login page
export const checkTokenBeforeLoadLoginPage = async (
  navigate: NavigateFunction
) => {
  try {
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];

    await axios.post(CHECK_TOKEN_ROLE_ADMIN, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    navigate("/auth/dashboard", { replace: true });
    return { props: {} };
  } catch (error: any) {
    if (!error.response) {
      navigate("/505", { replace: true });
      return { props: {} };
    }

    if (error.response.status === 401) {
      return makeNewAccessTokenToRequest(error, navigate);
    }

    if (error.response.status === 403) {
      navigate("/", { replace: true });
      return { props: {} };
    }

    return { props: {} };
  }
};
