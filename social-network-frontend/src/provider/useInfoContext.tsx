import React, { ReactNode, createContext, useContext } from "react";
import { parseCookies } from "nookies";

interface UserInfoContextProps {
  userRole: string | undefined;
}

export const UserInfoContext = createContext<UserInfoContextProps | null>(null);

export default function UserInfoProvider({
  children,
}: {
  children: ReactNode;
}) {
  let cookies = parseCookies();
  let userRoleCookies = cookies["role"];
  console.log("Role: " + userRoleCookies);
  return (
    <UserInfoContext.Provider value={{ userRole: userRoleCookies }}>
      {children}
    </UserInfoContext.Provider>
  );
}

// Custom hook to use the UserInfoContext
export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
};
