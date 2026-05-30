import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, Container, Pagination, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPet, deletePet, getPets, updatePet } from '../api/petsApi';
import CategoryFilter from '../components/catalog/CategoryFilter';
import PetCatalog from '../components/catalog/PetCatalog';
import PetFormDialog from '../components/catalog/PetFormDialog';
import SearchBar from '../components/catalog/SearchBar';

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

function categoryLabel(category) {
  if (!category) {
    return 'pets';
  }

  const labels = {
    CATS: 'Cats',
    DOGS: 'Dogs',
    FISH: 'Fish',
    BIRDS: 'Birds',
  };

  return labels[category] || category;
}

function buildEmptyMessage(search, category) {
  if (search && category) {
    return `No ${categoryLabel(category)} found for '${search}'`;
  }

  if (search) {
    return `No pets found for '${search}'`;
  }

  if (category) {
    return `No pets available in ${categoryLabel(category).toLowerCase()}`;
  }

  return 'No pets available right now. Please check back later.';
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = Number(searchParams.get('page') ?? 0);

  const [searchInput, setSearchInput] = useState(search);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const debouncedSearch = useDebouncedValue(searchInput, 300);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const trimmedSearch = debouncedSearch.trim();
    if (trimmedSearch === search) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    if (trimmedSearch) {
      nextParams.set('search', trimmedSearch);
    } else {
      nextParams.delete('search');
    }
    nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch, search, searchParams, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    getPets({
      search,
      category: category || undefined,
      page,
      size: 12,
      signal: controller.signal,
    })
      .then((data) => {
        setPets(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      })
      .catch((caughtError) => {
        if (caughtError?.name === 'CanceledError' || caughtError?.code === 'ERR_CANCELED') {
          return;
        }
        setError('Unable to load pets right now. Please try again.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category, page, refreshToken, search]);

  const emptyMessage = useMemo(() => buildEmptyMessage(search, category), [category, search]);

  function updateCategory(nextCategory) {
    const nextParams = new URLSearchParams(searchParams);
    if (nextCategory) {
      nextParams.set('category', nextCategory);
    } else {
      nextParams.delete('category');
    }
    nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  }

  function clearSearch() {
    setSearchInput('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('search');
    nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  }

  function changePage(_, uiPage) {
    const nextParams = new URLSearchParams(searchParams);
    if (uiPage <= 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(uiPage - 1));
    }
    setSearchParams(nextParams, { replace: true });
  }

  function openCreateDialog() {
    setSelectedPet(null);
    setDialogOpen(true);
  }

  function openEditDialog(pet) {
    setSelectedPet(pet);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setSelectedPet(null);
  }

  async function submitPet(payload) {
    if (selectedPet) {
      await updatePet(selectedPet.id, payload);
    } else {
      await createPet(payload);
    }
    setRefreshToken((value) => value + 1);
  }

  async function handleDelete(pet) {
    const confirmed = window.confirm(`Delete ${pet.name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    await deletePet(pet.id);
    setRefreshToken((value) => value + 1);
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            bgcolor: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 2, color: '#8b5e34' }}>
              Petstore
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
              Find your perfect pet
            </Typography>
            <Typography sx={{ mt: 1.5, color: 'text.secondary', maxWidth: 760 }}>
              Browse pets, search across names and breeds, filter by category, and manage inventory directly from the catalog.
            </Typography>
          </Box>

          <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={openCreateDialog}>
            Add pet
          </Button>
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Stack spacing={2}>
          <SearchBar value={searchInput} onChange={setSearchInput} onClear={clearSearch} />
          <CategoryFilter value={category} onChange={updateCategory} />
        </Stack>

        <PetCatalog
          pets={pets}
          loading={loading}
          emptyMessage={emptyMessage}
          onClear={search || category ? clearSearch : undefined}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />

        {totalPages > 1 ? (
          <Box display="flex" justifyContent="center" pb={2}>
            <Pagination page={page + 1} count={totalPages} onChange={changePage} color="primary" />
          </Box>
        ) : null}
      </Stack>

      <PetFormDialog open={dialogOpen} pet={selectedPet} onClose={closeDialog} onSubmit={submitPet} />
    </Container>
  );
}
