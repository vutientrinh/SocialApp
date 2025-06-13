import axios from "axios";
import React from "react";

const TestDownload = () => {
  const handleDownloadFromServer = async (filePath: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/file/downloadFile`,
        {
          params: { filePath },
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleDownloadFromCloudinary = async (
    imageId: string,
    imageName: string
  ) => {
    try {
      const imageUrl = `${process.env.REACT_APP_CLOUDINARY_URL}${imageId}`;
      const response = await fetch(imageUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${imageName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() =>
          handleDownloadFromServer(
            "uploadFiles/nullRzkuRGV2T3BzIHdpdGggR2l0SHViIGFuZCBEb2NrZXIgLnBwdHg=_24102024122417.pptx"
          )
        }
      >
        Download Image from Server
      </button>
      <button
        onClick={() =>
          handleDownloadFromCloudinary("koqyf2iovytb4jvpfus9", "Screenshot")
        }
      >
        Download Image from Cloudinary
      </button>
    </div>
  );
};

export default TestDownload;
