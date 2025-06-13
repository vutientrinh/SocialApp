import HttpService from "../helper/HttpService";

class PostApi extends HttpService {
  getPost = (postUUID: string) => {
    return this.get<any>(`api/post/${postUUID}`);
  };
  getPostList = (params: Record<string, any>) => {
    return this.getDataList<any>("api/post/get-all-post", params);
  };
  getPostProfile = (params: Record<string, any>) => {
    return this.getDataList<any>("api/post/get-all-post-by-user", params);
  };
}

const postApi = new PostApi("post");
export default postApi;
