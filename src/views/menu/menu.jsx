import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@mui/material";

const Menu = (props) => {
  const { search, setSearch } = props;

  return (
    <>
      <div className="menu">
        <TextField
          id="outlined-basic"
          label=""
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </>
  );
};

export default Menu;
