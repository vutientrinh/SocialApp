// get icon from fileType
const getIcon = (fileType: string) => {
  switch (fileType) {
    case "PDF":
      return `/static/files/pdf.png`;
    case "DOC":
    case "DOCX":
      return `/static/files/docx.png`;
    case "XLS":
    case "XLSX":
      return `/static/files/xls.png`;
    case "PPT":
      return `/static/files/ppt.png`;
    case "PPTX":
      return `/static/files/ppt.png`;
    case "ZIP":
      return `/static/files/zip.png`;
    case "TXT":
      return `/static/files/txt.png`;
    case "PNG":
      return `/static/files/png.png`;
    case "JPG":
    case "JPEG":
    case "GIF":
    case "BMP":
    case "SVG":
      return `/static/files/png.png`;
    default:
      return `/static/files/docx.png`;
  }
};

// component to display file item
const FileItem = ({
  fileName,
  fileType,
}: {
  fileName: string;
  fileType: string;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={getIcon(fileType)}
        alt={fileName}
        style={{ width: 24, height: 24, marginRight: 8 }}
      />
      <span>{fileName}</span>
    </div>
  );
};

export default FileItem;
