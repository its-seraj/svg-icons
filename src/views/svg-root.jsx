import { useState, useEffect } from "react";
import SvgItem from "./svg-item";
import BasicModal from "./modal";

const SvgRoot = (props) => {
  const { modalOpenRoot, setModalOpenRoot } = props;
  const [svgList, setSvgList] = useState([]);

  const fetchSVGs = async (isRefresh = false) => {
    if (svgList?.length > 0 && !isRefresh) {
      return;
    }

    // const url = `${window._env_.CODE_SNIPPETS_BACKEND}/card`;
    const url = `http://localhost:3000/svg`;
    const options = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          setSvgList(data.data);
        }
      })
      .catch((error) => {
        console.error("Error occured while fetching svg", error);
      });
  };

  useEffect(() => {
    fetchSVGs();
  }, []);

  return (
    <>
      <div className="svg-root">{svgList.length > 0 && svgList.map((svgObj, index) => <SvgItem key={index} data={svgObj} refresh={fetchSVGs} />)}</div>
      {modalOpenRoot && <BasicModal modalOpen={modalOpenRoot} setModalOpen={setModalOpenRoot} modalAction="new" refresh={fetchSVGs} />}
    </>
  );
};

export default SvgRoot;
