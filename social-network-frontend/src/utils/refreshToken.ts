import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { NavigateFunction } from "react-router-dom"; // or from 'next/navigation' if using Next.js

// Check if refresh token has expired and navigate if necessary
export const checkRefreshTokenExpired = async (navigate: NavigateFunction) => {
  try {
    const cookies = parseCookies();
    const refreshToken = cookies["refreshToken"];

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}oauth/refreshToken`,
      { refreshToken }
    );

    setCookie(null, "accessToken", data.data.accessToken, {
      maxAge: 604800,
      path: "/",
    });

    return { props: {} };
  } catch (error) {
    if (!error.response) {
      navigate("/505");
      return { props: {} };
    }

    navigate("/auth/login");
    return { props: {} };
  }
};

// Generate a new access token and retry the original request
export const makeNewAccessTokenToRequest = async (
  error: AxiosError,
  navigate: NavigateFunction
) => {
  try {
    const cookies = parseCookies();
    const refreshToken = cookies["refreshToken"];

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}oauth/refreshToken`,
      { refreshToken }
    );

    const accessToken = response.data.data.accessToken;

    // Make the new request with the updated access token
    const newRequest = {
      ...error.config,
      headers: {
        ...error.config?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
    await axios(newRequest);

    setCookie(null, "accessToken", accessToken, {
      maxAge: 604800,
      path: "/",
    });

    navigate("/admin/dashboard");
    return { props: {} };
  } catch (error) {
    if (!error.response) {
      navigate("/505");
      return { props: {} };
    }

    if (error.response?.status === 403) {
      navigate("/");
      return { props: {} };
    }

    return { props: {} };
  }
};
