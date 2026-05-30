import { Box, Button, Typography } from '@mui/material';

export default function EmptyState({ message, onClear }) {
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
      {onClear ? (
        <Button variant="outlined" onClick={onClear} sx={{ mt: 1 }}>
          Clear filters
        </Button>
      ) : null}
    </Box>
  );
}
