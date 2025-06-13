import { combineReducers } from "redux";
import chat from "./chat.reducer";
import common from "./common.reducer";
import notification from "./notification.reducer";
import sidebar from "./sidebar.reducer";
import user from "./user.reducer";
import dialog from "./dialog.reducer";
import profile from "./profile.reducer";
import post from "./post.reducer";
import image from "./image.reducer";
import comment from "./comment.reducer";
import reaction from "./reaction.reducer";
import friend from "./friend.reducer";
import folder from "./folder.reducer";
import report from "./report.reducer";
import follow from "./follow.reducer";

const rootReducers = combineReducers({
  [user.name]: user.reducer,
  [common.name]: common.reducer,
  [notification.name]: notification.reducer,
  [sidebar.name]: sidebar.reducer,
  [chat.name]: chat.reducer,
  [dialog.name]: dialog.reducer,
  [profile.name]: profile.reducer,
  [post.name]: post.reducer,
  [image.name]: image.reducer,
  [comment.name]: comment.reducer,
  [reaction.name]: reaction.reducer,
  [friend.name]: friend.reducer,
  [folder.name]: folder.reducer,
  [report.name]: report.reducer,
  [follow.name]: follow.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducers>;
export default rootReducers;
