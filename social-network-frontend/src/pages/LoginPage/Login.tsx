import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { Client, Stomp } from "@stomp/stompjs";
import axios from "axios";
import { setCookie } from "nookies";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { commonStore } from "../../store/reducers";
import { checkTokenBeforeLoadAdminPage } from "../../utils/checkToken";
import { ImageStyle, InputStyle, LoginStyle } from "./style";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const SOCKET_URL = `${process.env.REACT_APP_BACKEND_URL}ws`;
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);

    const onConnect = () => {
      stompClient.subscribe(`/user/public`, (message) => {
        console.log("Subscribe successfully!!!!!");
      });
    };
    stompClient.connect({}, onConnect);
    setStompClient(stompClient);

    stompClient.activate();
    return () => {
      if (stompClient) {
        stompClient.deactivate();
        // Only deactivate when component unmounts
      }
    };
  }, []);
  const sendConnect = async (user: string) => {
    console.log(user);
    if (stompClient) {
      try {
        const userUUID = user;
        stompClient.publish({
          destination: "/app/user.addUser",
          body: JSON.stringify(userUUID),
        });
        console.log("send successfully");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.error("STOMP client is not connected.");
    }
  };

  const onSubmit = (data: IFormInput) => {
    const tranformedData = {
      username: data.username,
      password: data.password,
    };
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}api/auth/signin`,
        tranformedData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        const defaultLocale = response.data.defaultLocale;
        const username = response.data.username;
        const userUUID = response.data.uuid;
        const role = response.data.roles[0];

        // Set token to cookie
        setCookie(null, "accessToken", accessToken, {
          maxAge: 604800,
          path: "/",
        });
        setCookie(null, "refreshToken", refreshToken, {
          maxAge: 604800,
          path: "/",
        });

        // Set user info to cookie
        setCookie(null, "role", role, { maxAge: 604800, path: "/" });
        setCookie(null, "username", username, { maxAge: 604800, path: "/" });
        setCookie(null, "defaultLocale", defaultLocale, {
          maxAge: 604800,
          path: "/",
        });
        setCookie(null, "uuid", userUUID, { maxAge: 604800, path: "/" });
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-username/${username}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            }
          )
          .then((profileResponse) => {
            const userProfile = profileResponse.data.data;
            if (userProfile) {
              sendConnect(response.data.uuid);
              checkTokenBeforeLoadAdminPage(navigate);
            } else {
              navigate("/auth/profile");
            }
          })
          .catch((error) => {
            dispatch(
              commonStore.actions.setErrorMessage(error.response?.data.message)
            );
          });
        console.log("Done check profile");
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          dispatch(
            commonStore.actions.setErrorMessage("You don't have Internet")
          );
        } else {
          dispatch(
            commonStore.actions.setErrorMessage(
              "Login failed. Account blocked or invalid credentials. Contact admin."
            )
          );
        }
      });
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1,
        userSelect: "none",
      }}
    >
      <LoginStyle>
        <ImageStyle>
          <Box sx={{ width: "100%", height: "100%" }}>
            <img
              src="/static/image/loginimage.svg"
              style={{ height: "100%", width: "100%" }}
            />
          </Box>
        </ImageStyle>
        <Container>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 30 }}>Login to </Typography>
            <Box
              component="img"
              sx={{
                objectFit: "contain",
                width: "80%",
                height: "80%",
              }}
              src="/static/logo/sentry-full.svg"
              alt="Logo"
            />
          </Box>
          <InputStyle>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <FormHelperText error>
                    {errors.username.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <FormHelperText error>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{ width: "80%" }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ width: "80%", marginTop: "20px" }}
                  onClick={() => navigate("/auth/register")}
                >
                  Register
                </Button>
              </Box>
            </form>
          </InputStyle>
        </Container>
      </LoginStyle>
    </Box>
  );
};

export default LoginPage;
