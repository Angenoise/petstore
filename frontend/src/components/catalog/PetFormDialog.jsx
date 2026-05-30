import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  breed: '',
  age: 0,
  price: '',
  description: '',
  imageUrl: '',
  available: true,
  category: 'DOGS',
};

export default function PetFormDialog({ open, pet, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pet) {
      setForm({
        name: pet.name ?? '',
        breed: pet.breed ?? '',
        age: pet.age ?? 0,
        price: pet.price ?? '',
        description: pet.description ?? '',
        imageUrl: pet.imageUrl ?? '',
        available: Boolean(pet.available),
        category: pet.category ?? 'DOGS',
      });
    } else {
      setForm(emptyForm);
    }
  }, [pet, open]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        age: Number(form.age),
        price: Number(form.price),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{pet ? 'Edit pet' : 'Add a new pet'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(event) => updateField('name', event.target.value)} required fullWidth />
            <TextField label="Breed" value={form.breed} onChange={(event) => updateField('breed', event.target.value)} required fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Age in months"
                type="number"
                inputProps={{ min: 0 }}
                value={form.age}
                onChange={(event) => updateField('age', event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                inputProps={{ min: 0.01, step: '0.01' }}
                value={form.price}
                onChange={(event) => updateField('price', event.target.value)}
                required
                fullWidth
              />
            </Stack>
            <TextField
              label="Description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              required
              multiline
              minRows={3}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={form.imageUrl}
              onChange={(event) => updateField('imageUrl', event.target.value)}
              required
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <Select value={form.category} onChange={(event) => updateField('category', event.target.value)}>
                  <MenuItem value="CATS">Cats</MenuItem>
                  <MenuItem value="DOGS">Dogs</MenuItem>
                  <MenuItem value="FISH">Fish</MenuItem>
                  <MenuItem value="BIRDS">Birds</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch checked={form.available} onChange={(event) => updateField('available', event.target.checked)} />}
                label="Available"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving...' : pet ? 'Save changes' : 'Create pet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
