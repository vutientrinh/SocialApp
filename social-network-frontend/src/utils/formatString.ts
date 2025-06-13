export interface ImageURLS {
  createdAt: Date;
  name: string;
  url: string;
  uuid: string;
}

export const fToConvertStringToListString = (text: string): string[] => {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// export const fToGetFirstURL = (str: string): string[] => {};

export const fToConvertObjImgsToListStringURL = (
  imageURLs: ImageURLS[]
): string[] => {
  if (!Array.isArray(imageURLs)) {
    return [];
  }

  return imageURLs.map((image) => image.url);
};

export const fGetIdFromURLCloudinary = (url: string): string => {
  // url = https://res.cloudinary.com/dtrb7dkmw/image/upload/o8cm2qu9sqgwj3dz3610
  // return o8cm2qu9sqgwj3dz3610
  const arr = url.split("/");
  return arr[arr.length - 1];
};

export const fGetTheFirstLetterOfString = (str: string): string => {
  return str[0].toLowerCase();
};
