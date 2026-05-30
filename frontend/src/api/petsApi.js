import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getPets({ search, category, page = 0, size = 12, signal } = {}) {
  const params = { page, size };

  if (search && search.trim()) {
    params.search = search.trim();
  }

  if (category) {
    params.category = category;
  }

  const { data } = await api.get('/api/v1/pets', { params, signal });
  return data;
}

export async function getPetById(id, signal) {
  const { data } = await api.get(`/api/v1/pets/${id}`, { signal });
  return data;
}

export async function createPet(payload) {
  const { data } = await api.post('/api/v1/pets', payload);
  return data;
}

export async function updatePet(id, payload) {
  const { data } = await api.put(`/api/v1/pets/${id}`, payload);
  return data;
}

export async function deletePet(id) {
  await api.delete(`/api/v1/pets/${id}`);
}
