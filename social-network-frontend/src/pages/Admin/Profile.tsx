import React, { useEffect } from "react";
import profileApi from "../../api/profile.api";

const Profile: React.FC = () => {
  useEffect(() => {
    console.log("step fetchData");
    const fetchData = async () => {
      try {
        const response = await profileApi.getListProfile();
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>
        {process.env.REACT_APP_BACKEND_URL
          ? process.env.REACT_APP_BACKEND_URL
          : "undefield"}
      </h1>
    </div>
  );
};

export default Profile;
// fileName is the same with the component name
// Ex: User.tsx match with User component
