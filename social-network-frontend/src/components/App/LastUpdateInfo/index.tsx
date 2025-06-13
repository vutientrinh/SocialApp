import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export type LastUpdateInfoProps = {
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  sx?: any;
};
const LastUpdateInfo: React.FC<LastUpdateInfoProps> = (props) => {
  const { t } = useTranslation();
  const { lastUpdatedAt, lastUpdatedBy, sx } = props;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{ color: "black", fontSize: "13px", ...sx }}
    >
      {(lastUpdatedBy || lastUpdatedAt) && <>{t("label.lastUpdated")}</>}

      {lastUpdatedBy && (
        <>
          {t("label.by")} {lastUpdatedBy}
        </>
      )}
      {lastUpdatedBy && lastUpdatedAt && " "}
      {lastUpdatedAt && (
        <>
          {t("label.on")} {lastUpdatedAt}
        </>
      )}
    </Stack>
  );
};

export default LastUpdateInfo;
