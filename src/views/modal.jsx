import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SvgForm from "./svgForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  height: "620px",
  bgcolor: "var(--background)",
  border: "none",
  outline: "none",
  borderRadius: "12px",
  padding: "2px",
  "@media (max-width: 820px)": {
    width: "90vw !important",
  },
};

const BasicModal = (props) => {
  console.log("props inside Modal", props);
  const { modalOpen, setModalOpen, modalAction, svgDetails, refresh } = props;

  const handleClose = () => setModalOpen(false);

  return (
    <div>
      <Modal open={modalOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="modal-box-root">
            <SvgForm action={modalAction} svgDetails={svgDetails} modalOpen={modalOpen} setModalOpen={setModalOpen} refresh={refresh} />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
