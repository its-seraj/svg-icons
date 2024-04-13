import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SvgItem from "./svg-item";
import BasicModal from "./modal";
import { SVGSkeleton } from "./skeleton";

const SvgRoot = (props) => {
  const { modalOpenRoot, setModalOpenRoot } = props;
  const [svgList, setSvgList] = useState([]);
  const [counts, setCounts] = useState();
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const fetchSVGs = async (isRefresh = false) => {
    setLoading(true);
    // if (svgList?.length > 0 && !isRefresh) {
    //   return;
    // }

    const url = `${window._env_.CODE_SNIPPETS_BACKEND}/svg?offset=${offset}`;
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
          setLoading(false);
          setSvgList((prev) => [...prev, ...data.data]);
        }
      })
      .catch((error) => {
        console.error("Error occured while fetching svg", error);
      });
    setLoading(false);
  };
  const fetchCounts = async () => {
    if (counts && counts > 0) {
      return;
    }

    const url = `${window._env_.CODE_SNIPPETS_BACKEND}/svg/counts`;
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
          setCounts(data.counts);
        }
      })
      .catch((error) => {
        console.error("Error occured while fetching svg", error);
      });
  };

  const loadMore = (entries) => {
    if (entries[0].isIntersecting && !loading && offset < counts) {
      setOffset((prevPage) => prevPage + 200);
    }
  };

  useEffect(() => {
    fetchCounts();

    /* scroll to top */
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 2) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    fetchSVGs();
  }, [offset]);

  useEffect(() => {
    // Create an IntersectionObserver
    const observer = new IntersectionObserver(loadMore, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    // Observe the last card element
    const lastCard = document.querySelector(".svg-item:last-child");
    if (svgList.length > 0) {
      observer.observe(lastCard);
    }

    // Cleanup function
    return () => {
      if (svgList.length > 0) {
        observer.unobserve(lastCard);
      }
    };
  }, [svgList, loading]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="total-count">{counts}</div>
      <div className="svg-root">
        {svgList.length > 0 ? svgList.map((svgObj, index) => <SvgItem key={index} data={svgObj} refresh={fetchSVGs} />) : <SVGSkeleton />}
        {loading && <SVGSkeleton />}
      </div>
      {showScrollButton && (
        <div className="scroll-to-top" onClick={handleScrollToTop}>
          <KeyboardArrowUpIcon />
        </div>
      )}
      {modalOpenRoot && <BasicModal modalOpen={modalOpenRoot} setModalOpen={setModalOpenRoot} modalAction="new" refresh={fetchSVGs} />}
    </>
  );
};

export default SvgRoot;
