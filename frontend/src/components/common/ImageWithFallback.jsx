import PetsIcon from '@mui/icons-material/Pets';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function ImageWithFallback({ src, alt, height = 220 }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
          bgcolor: 'rgba(243, 196, 137, 0.22)',
        }}
      >
        <PetsIcon sx={{ fontSize: 56, color: '#8b5e34' }} aria-label="Image placeholder" />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      sx={{
        width: '100%',
        height,
        objectFit: 'cover',
        borderRadius: 3,
        display: 'block',
      }}
    />
  );
}
