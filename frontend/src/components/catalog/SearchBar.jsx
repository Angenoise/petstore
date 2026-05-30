import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by name, breed, or description"
      label="Search pets"
      inputProps={{ maxLength: 100 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton aria-label="Clear search" edge="end" onClick={onClear}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
