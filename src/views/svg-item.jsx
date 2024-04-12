import { useRef, useState, useEffect } from "react";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import SettingsIcon from "@mui/icons-material/Settings";
import DoneIcon from "@mui/icons-material/Done";
import BasicModal from "./modal";

const SvgItem = (props) => {
  const { data, refresh } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [resolution, setResolution] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const svgRef = useRef(null);
  const isAccessible = localStorage.getItem("resource");

  function getViewBoxFromSVG(svgString) {
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = svgString.trim();

    var svgElement = tempDiv.getElementsByTagName("svg")[0];

    if (svgElement && svgElement.getAttribute("viewBox")) {
      return svgElement.getAttribute("viewBox");
    } else {
      return null;
    }
  }
  function getHeightWidthFromViewBox(viewBox) {
    var viewBoxValues = viewBox.split(/\s+/);

    var width = parseFloat(viewBoxValues[2]);
    var height = parseFloat(viewBoxValues[3]);

    return { width: width, height: height };
  }

  const copyButtonHandler = () => {
    const svgContent = svgRef.current.innerHTML;
    navigator.clipboard
      .writeText(svgContent)
      .then(() => {
        setIsCopied(true);
        setAnimationClass("show");
        console.log("SVG content copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying SVG content:", error);
      });
  };

  useEffect(() => {
    if (isCopied) {
      const timeoutId = setTimeout(() => {
        setAnimationClass("");
        setIsCopied(false);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isCopied]);

  useEffect(() => {
    if (data) {
      const viewbox = getViewBoxFromSVG(data.svg);
      const { height, width } = getHeightWidthFromViewBox(viewbox);
      setResolution({ width, height });
    }
  }, []);

  return (
    <>
      <div className="svg-item">
        {isAccessible === "admin" && (
          <div onClick={() => setModalOpen(true)} className="edit-btn">
            <SettingsIcon />
          </div>
        )}
        {data?.svg && <div ref={svgRef} dangerouslySetInnerHTML={{ __html: data.svg }} />}
        <div className="title">{data.title}</div>
        {resolution && <div className="resolution">{`${resolution.width} x ${resolution.height}`}</div>}
        <div onClick={copyButtonHandler} className="copy-btn-root">
          <div className="copy-btn">
            <ContentPasteIcon />
            {isCopied && <DoneIcon className={`done-icon ${animationClass}`} />}
          </div>
        </div>
        {modalOpen && <BasicModal modalOpen={modalOpen} setModalOpen={setModalOpen} svgDetails={data} modalAction={"edit"} refresh={refresh} />}
      </div>
    </>
  );
};

export default SvgItem;
