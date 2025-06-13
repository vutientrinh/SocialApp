import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: require("./en/common.json"),
  },
  vi: {
    common: require("./vi/common.json"),
  },
  de: {
    common: require("./de/common.json"),
  },
  fr: {
    common: require("./fr/common.json"),
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",
  resources: resources,
  ns: ["common"],
  defaultNS: "common",
  supportedLngs: ["en", "vi", "de", "fr"],
});

i18n.languages = ["en", "vi", "de", "fr"];

export default i18n;
