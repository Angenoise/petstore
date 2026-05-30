import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePet, getPetById } from '../api/petsApi';
import ImageWithFallback from '../components/common/ImageWithFallback';
import LoadingSpinner from '../components/common/LoadingSpinner';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function formatAge(ageInMonths) {
  if (ageInMonths >= 12) {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return `${years} years ${months} months`;
  }

  return `${ageInMonths} months`;
}

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setNotFound(false);
    setError('');

    getPetById(id, controller.signal)
      .then((data) => setPet(data))
      .catch((caughtError) => {
        if (caughtError?.response?.status === 404) {
          setNotFound(true);
          return;
        }

        if (caughtError?.name === 'CanceledError' || caughtError?.code === 'ERR_CANCELED') {
          return;
        }

        setError('Unable to load this pet right now.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  async function handleDelete() {
    if (!pet) {
      return;
    }

    const confirmed = window.confirm(`Delete ${pet.name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    await deletePet(pet.id);
    navigate('/');
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (notFound || !pet) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Pet not found</Typography>
          <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>
            Back to catalog
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Button variant="text" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>
          Back
        </Button>

        <ImageWithFallback src={pet.imageUrl} alt={pet.name} height={360} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h3" component="h1">
              {pet.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {pet.breed}
            </Typography>
          </Box>
          <Chip label={pet.available ? 'Available' : 'Unavailable'} color={pet.available ? 'success' : 'error'} />
        </Stack>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip label={pet.category} variant="outlined" />
          <Chip label={formatAge(pet.age)} variant="outlined" />
          <Chip label={formatPrice(pet.price)} variant="outlined" />
        </Stack>

        <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {pet.description}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => navigate('/') }>
            Manage in catalog
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={handleDelete}>
            Delete pet
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
