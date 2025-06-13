import HttpService from "../helper/HttpService";

class ProfileApi extends HttpService {
  getListProfile = () => {
    return this.get<any>("api/profile/get-all-profiles");
  };
  getListOwnProfile = (uuid?: string) => {
    return this.post<any>("api/post/get-owner", {
      uuid,
    });
  };
  getProfileByUserName = (username: string) => {
    return this.get<any>(`api/profile/get-profile-by-username/${username}`);
  };
  getProfileByUserUUID = (uuid: string) => {
    return this.get<any>(`api/profile/get-profile-by-user-uuid/${uuid}`);
  };
  createProfile = () => {
    return this.post<any>(`api/profile/create-profile`);

  };
}

const profileApi = new ProfileApi("");

export default profileApi;
