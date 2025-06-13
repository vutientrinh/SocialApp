import HttpService from "../helper/HttpService";

class UserApi extends HttpService {
  // get user by uuid
  getUser = (userUUID: string) => {
    return this.get<any>(`api/user/${userUUID}`);
  };
  // get all user
  getUserList = (params: Record<string, any>) => {
    return this.getDataList<any>("api/user/get-all-user", params);
  };

  // get profile that user currently logged in
  getProfileByUser = () => {
    return this.get<any>("api/profile/get-profile-by-user");
  };
}

const userApi = new UserApi("user");
export default userApi;
