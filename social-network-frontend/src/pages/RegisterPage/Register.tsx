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
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { commonStore } from "../../store/reducers";
import { ImageStyle, InputStyle, LoginStyle } from "../LoginPage/style";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    const tranformedData = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: ["ROLE_USER"],
    };
    console.log(
      "Register link : ",
      `${process.env.REACT_APP_BACKEND_URL}api/auth/register`
    );
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // sends cookies if any (like `withCredentials` in axios)
          body: JSON.stringify(tranformedData),
        }
      );

      if (!response.ok) {
        // Handle errors if response is not 200 OK
        const errorData = await response.json();
        console.log("Error message:", errorData.message);
        return;
      }

      const result = await response.json();
      dispatch(
        commonStore.actions.setSuccessMessage(
          "Create new account successfully!!"
        )
      );
      navigate("/auth/login");
    } catch (error) {
      dispatch(
        commonStore.actions.setErrorMessage(error.response?.data.message)
      );
    }
  };

  return (
    <Box
      sx={{
        position: "relative", // Để cho phép lớp phủ và LoginStyle định vị trên cùng một lớp
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.2)", // Màu tối với độ mờ
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
            <Typography style={{ fontSize: 28 }}>Welcome to</Typography>
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
                <InputLabel htmlFor="username">User name</InputLabel>
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
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <FormHelperText error>{errors.email.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required", // Required validation
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters", // Min length validation
                    },
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
                  Create
                </Button>
              </Box>
            </form>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              style={{ width: "80%", marginTop: 10 }}
              onClick={() => navigate("/auth/login")}
            >
              Back to login
            </Button>
          </InputStyle>
        </Container>
      </LoginStyle>
    </Box>
  );
};

export default Register;
