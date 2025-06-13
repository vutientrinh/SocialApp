import HttpService from "../helper/HttpService";

class ChatApi extends HttpService {
  getChatList = (uuid: string, receiverUUID: string) => {
    return this.get<any>(
      `${process.env.REACT_APP_BACKEND_URL}api/chat/messages/${uuid}/${receiverUUID}`
    );
  };
}

const chatApi = new ChatApi("");

export default chatApi;
