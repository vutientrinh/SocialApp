import axios, { AxiosInstance, ResponseType } from "axios";
import { parseCookies, setCookie } from "nookies";
import { plural } from "pluralize";
import { NavigateFunction } from "react-router-dom";

class HttpService<GetList = any> {
  protected instance: AxiosInstance;
  protected entity: string;
  private navigate: NavigateFunction | null;

  constructor(entity: string, navigate: NavigateFunction | null = null) {
    this.entity = plural(entity);
    this.navigate = navigate;
    axios.defaults.withCredentials = true;

    this.instance = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL,
    });

    this.instance.interceptors.response.use(
      this.handleSuccessRes,
      this.handleErrorRes
    );
  }

  private handleSuccessRes({ data, status }: { data: any; status: any }) {
    return { data, status } as any;
  }

  private async handleErrorRes(error: any) {
    let formatError = {};
    if (error?.response) {
      const { data, status } = error.response;

      switch (status) {
        case 401:
          const cookies = parseCookies();
          const refreshToken = cookies["refreshToken"];

          try {
            const response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}api/auth/refreshtoken`,
              { refreshToken }
            );

            const accessToken = response.data.data.accessToken;
            setCookie(null, "accessToken", accessToken, {
              maxAge: 604800,
              path: "/",
            });

            const newRequest = {
              ...error.config,
              headers: {
                ...error.config.headers,
                Authorization: "Bearer " + accessToken,
              },
            };

            if (newRequest.url.includes("import")) {
              newRequest.headers["Content-Type"] = "multipart/form-data";
            }

            return await axios(newRequest);
          } catch (refreshError) {
            if (
              refreshError.response.status === 400 ||
              refreshError.response.status === 404
            ) {
              formatError = {
                status: refreshError.response.status,
                message: refreshError.response.data.message,
              };
            } else if (refreshError.response.status === 500 && this.navigate) {
              this.navigate("/500");
            } else if (this.navigate) {
              this.navigate("/auth/login");
            }
            return Promise.reject(formatError);
          }

        case 503:
          if (this.navigate) {
            this.navigate("/503");
          }
          break;

        default:
          break;
      }

      const { message, ...restData } =
        typeof data === "string" ? JSON.parse(data) : data;
      formatError = { message, status, ...restData };
    }

    if (error?.code === "ECONNABORTED") {
      formatError = { message: "Request aborted", status: "canceled" };
    }

    if (process.env.REACT_APP_MODE === "development") {
      console.log("error", ">>>", error);
      console.log("error to JSON", ">>>", error.toJSON());
    }

    return Promise.reject(formatError);
  }

  protected saveToken = (context: any) => {
    const cookies = parseCookies(context);
    const accessToken = cookies["accessToken"];
    const locale = cookies["defaultLocale"] || "en";
    // Set token if had
    if (accessToken) {
      this.instance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        locale: locale,
      };
    } else {
      delete this.instance.defaults.headers.Authorization;
    }
  };

  protected setHeaderForApiTransferFile = (context: any) => {
    const cookies = parseCookies(context);
    const accessToken = cookies["accessToken"];
    const locale = cookies["defaultLocale"];
    // Set token if had
    if (accessToken) {
      this.instance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
        locale: locale,
      };
    } else {
      delete this.instance.defaults.headers.Authorization;
    }
  };

  get = <T = any>(
    endpoint: string,
    params = {} as Record<string, any>,
    context: any = null,
    responseType = "default" as ResponseType
  ) => {
    this.saveToken(context);
    return this.instance.get<T>(endpoint, { params, responseType });
  };

  getList = (params = {} as Record<string, any>, context: any = null) =>
    this.get<GetList>(this.entity, params, context);

  // Get list with filter
  // (Get entity {has filter} , filter, {params})
  getListData = <T = any>(
    data = {} as Record<string, any>,
    params = {} as Record<string, any>,
    context: any = null,
    responseType = "default" as ResponseType
  ) => {
    this.saveToken(context);
    return this.instance.post<T>(this.entity, data, { params, responseType });
  };

  // Get list with filter
  // (End-Point {URL}, params}
  getDataList = <T = any>(
    endpoint: string,
    params = {} as Record<string, any>,
    context: any = null,
    responseType = "default" as ResponseType
  ) => {
    this.saveToken(context);
    return this.instance.get<T>(endpoint, { params, responseType });
  };

  post = <T = any>(
    endpoint: string,
    data = {} as Record<string, any>,
    params = {} as Record<string, any>,
    context: any = null
  ) => {
    this.saveToken(context);
    return this.instance.post<T>(endpoint, data, { params });
  };

  put = <T = any>(
    endpoint: string,
    params = {} as Record<string, any>,
    data = {} as Record<string, any>,
    context: any = null
  ) => {
    this.saveToken(context);
    return this.instance.put<T>(endpoint, data, { params });
  };

  delete = <T = any>(
    endpoint: string,
    data = {} as Record<string, any>,
    context: any = null
  ) => {
    this.saveToken(context);
    return this.instance.delete<T>(endpoint, { data: data });
  };
}

export default HttpService;
