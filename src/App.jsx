import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { GlobalStyles } from "./GlobalStyles";
import Menu from "./views/menu/menu";
import SvgRoot from "./views/svg-root";
import { Divider } from "@mui/material";
import ContrastIcon from "@mui/icons-material/Contrast";
import AddIcon from "@mui/icons-material/Add";
import PowerMenu from "./views/menu/powerMenu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [modalOpenRoot, setModalOpenRoot] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [search, setSearch] = useState("");

  const isAccessible = localStorage.getItem("resource");

  const newCardHandler = () => {
    setModalOpenRoot(true);
  };

  useEffect(() => {
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

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {GlobalStyles}
      <div className="theme-toggle-button" onClick={toggleTheme}>
        {theme === "dark" ? (
          <span className="material-icons" title="Switch to Light Mode">
            <ContrastIcon style={{ width: "4vw", height: "4vw", maxHeight: "24px" }} />
          </span>
        ) : (
          <span className="material-icons" title="Switch to Dark Mode">
            <ContrastIcon style={{ width: "4vw", height: "4vw", maxHeight: "24px" }} />
          </span>
        )}
      </div>
      <PowerMenu />
      <Menu search={search} setSearch={setSearch} />
      {isAccessible === "admin" && (
        <div className="action-menu">
          <Divider className="root-divider" />
          <div className="action">
            <div></div>
            <div onClick={newCardHandler} className="new-card-btn">
              <AddIcon />
              <span>New SVG</span>
            </div>
          </div>
        </div>
      )}
      <SvgRoot modalOpenRoot={modalOpenRoot} setModalOpenRoot={setModalOpenRoot} search={search} setSearch={setSearch} />
      {showScrollButton && (
        <div className="scroll-to-top" onClick={handleScrollToTop}>
          <KeyboardArrowUpIcon />
        </div>
      )}
    </>
  );
}

export default App;
