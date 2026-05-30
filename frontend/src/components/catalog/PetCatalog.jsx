import { Grid } from '@mui/material';
import EmptyState from './EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import PetCard from './PetCard';

export default function PetCatalog({ pets, loading, emptyMessage, onClear, onEdit, onDelete }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!pets.length) {
    return <EmptyState message={emptyMessage} onClear={onClear} />;
  }

  return (
    <Grid container spacing={3}>
      {pets.map((pet) => (
        <Grid item key={pet.id} xs={12} sm={6} md={4} lg={3}>
          <PetCard pet={pet} onEdit={() => onEdit(pet)} onDelete={() => onDelete(pet)} />
        </Grid>
      ))}
    </Grid>
  );
}
