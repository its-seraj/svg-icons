import { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { Editor } from "./AceEditor";
import { useTheme } from "../ThemeProvider";
import config from "./../config.json";

const SvgForm = (props) => {
  console.log("props inside Cardform", props);
  const { action, svgDetails, setModalOpen, refresh } = props;
  const { category } = config;

  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState(svgDetails?.title || "");
  const [selectedCategory, setSelectedCategory] = useState(svgDetails?.category || "");
  const [editorValue, setEditorValue] = useState(svgDetails?.svg || "");

  const { theme } = useTheme();
  const filter = createFilterOptions();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      title,
      category: selectedCategory,
      svg: editorValue,
      svgUuid: svgDetails?.svgUuid,
    };
    // const url = `${window._env_.CODE_SNIPPETS_BACKEND}/card`;
    const url = `http://localhost:3000/svg`;
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    await fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          refresh(true);
          setModalOpen(false);
        } else {
          setErrorMessage(data?.error || data?.message);
        }
      })
      .catch((error) => {
        console.error("Error occured while saving svg", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-root">
        <div className="form-body">
          <TextField id="title" label="" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter titles" />
          <Autocomplete
            value={selectedCategory}
            onChange={(event, newValue) => {
              let value = "";
              if (typeof newValue === "string") {
                value = newValue;
              } else if (newValue && newValue.inputValue) {
                value = newValue.inputValue;
              } else {
                value = newValue;
              }
              setSelectedCategory(value);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some((option) => inputValue === option);
              if (inputValue !== "" && !isExisting) {
                filtered.push({ inputValue, title: `Add "${inputValue}"` });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={category}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.title;
            }}
            renderOption={(props, option) => <li {...props}>{option.title ?? option}</li>}
            freeSolo
            renderInput={(params) => <TextField {...params} label="" placeholder={selectedCategory || "Select Category"} />}
          />
          <Editor
            mode="html"
            dark={theme === "dark"}
            onChange={(value) => {
              setEditorValue(value);
            }}
            editable={true}
            value={editorValue}
            maxLines={10}
          />
        </div>

        <button type="submit" className="save-card-btn">
          {action === "new" ? "Create Icon" : "Update Icon"}
        </button>
        {errorMessage ? <p className="error-message">Error: {errorMessage}</p> : <p className="error-message"></p>}
      </div>
    </form>
  );
};

export default SvgForm;
