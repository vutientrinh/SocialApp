import { useEffect, useRef, useState } from "react";
// material
import { alpha } from "@mui/material/styles";
import { Box, MenuItem, Stack, IconButton } from "@mui/material";
// components
import MenuPopover from "../Common/MenuPopover/MenuPopover";
import { useTranslation } from "react-i18next";
import { parseCookies } from "nookies";

export default function LanguagePopover() {
  const { t, i18n } = useTranslation();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Track current selected language
  const cookies = parseCookies();
  const [currentLanguage, setCurrentLanguage] = useState(
    cookies["defaultLocale"] || "en"
  );
  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle language selection and update the current language
  const handleChoiceLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    document.cookie = `defaultLocale=${lang};`;
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.focusOpacity
              ),
          }),
        }}
      >
        <img
          src={`/static/icons/ic_flag_${currentLanguage}.svg`}
          alt={t(`language.${currentLanguage}`)}
        />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Stack spacing={0.75}>
          <MenuItem
            selected={currentLanguage === "en"}
            onClick={() => handleChoiceLanguage("en")}
          >
            <Box
              component="img"
              alt="English"
              src="/static/icons/ic_flag_en.svg"
              sx={{ width: 28, mr: 2 }}
            />
            {t("language.English")}
          </MenuItem>

          <MenuItem
            selected={currentLanguage === "vi"}
            onClick={() => handleChoiceLanguage("vi")}
          >
            <Box
              component="img"
              alt="English"
              src="/static/icons/ic_flag_vi.svg"
              sx={{ width: 28, mr: 2 }}
            />
            {t("language.Vietnam")}
          </MenuItem>

          <MenuItem
            selected={currentLanguage === "de"}
            onClick={() => handleChoiceLanguage("de")}
          >
            <Box
              component="img"
              alt="German"
              src="/static/icons/ic_flag_de.svg"
              sx={{ width: 28, mr: 2 }}
            />
            {t("language.German")}
          </MenuItem>

          <MenuItem
            selected={currentLanguage === "fr"}
            onClick={() => handleChoiceLanguage("fr")}
          >
            <Box
              component="img"
              alt="French"
              src="/static/icons/ic_flag_fr.svg"
              sx={{ width: 28, mr: 2 }}
            />
            {t("language.French")}
          </MenuItem>
        </Stack>
      </MenuPopover>
    </>
  );
}
