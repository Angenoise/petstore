import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from '../common/ImageWithFallback';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function PetCard({ pet, onEdit, onDelete }) {
  const navigate = useNavigate();

  function openDetail() {
    navigate(`/pets/${pet.id}`);
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.08)',
        bgcolor: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ cursor: 'pointer' }} onClick={openDetail}>
        <ImageWithFallback src={pet.imageUrl} alt={pet.name} height={210} />
      </Box>

      <CardContent sx={{ pb: 1 }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box>
              <Typography variant="h6" component="h3">
                {pet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pet.breed}
              </Typography>
            </Box>
            <Chip
              label={pet.available ? 'Available' : 'Unavailable'}
              color={pet.available ? 'success' : 'error'}
              size="small"
            />
          </Stack>

          <Typography variant="body1" fontWeight={700} color="#8c4f1d">
            {formatPrice(pet.price)}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Category: {pet.category}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button size="small" onClick={openDetail}>
          View details
        </Button>
        <Stack direction="row" spacing={0.5}>
          <Button size="small" startIcon={<EditOutlinedIcon />} onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={onDelete}>
            Delete
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
