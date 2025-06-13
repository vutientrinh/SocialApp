import { Helmet } from "react-helmet";

export const HeaderDashboard = () => {
  return (
    <Helmet>
      <title>Flick - Dashboard</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};

export const HeaderMainPage = () => {
  return (
    <Helmet>
      <title>Flick - MainPage</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};

export const HeaderNotification = ({ number }: { number: number }) => {
  return (
    <Helmet>
      <title>{`${number} new messages`}</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};
