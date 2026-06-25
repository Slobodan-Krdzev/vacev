import type { AuthResponse, Project, Subcategory } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

export async function getSubcategories(category?: string): Promise<Subcategory[]> {
  const query = category ? `?category=${category}` : '';
  return request<Subcategory[]>(`/api/subcategories${query}`);
}

export async function getAdminSubcategories(token: string, category?: string): Promise<Subcategory[]> {
  const query = category ? `?category=${category}` : '';
  return request<Subcategory[]>(`/api/admin/subcategories${query}`, {}, token);
}

export async function createSubcategory(
  data: { name: string; category: string; order?: number },
  token: string
): Promise<Subcategory> {
  return request<Subcategory>(
    '/api/admin/subcategories',
    { method: 'POST', body: JSON.stringify(data) },
    token
  );
}

export async function updateSubcategory(
  id: string,
  data: { name?: string; category?: string; order?: number },
  token: string
): Promise<Subcategory> {
  return request<Subcategory>(
    `/api/admin/subcategories/${id}`,
    { method: 'PUT', body: JSON.stringify(data) },
    token
  );
}

export async function deleteSubcategory(id: string, token: string): Promise<void> {
  await request(`/api/admin/subcategories/${id}`, { method: 'DELETE' }, token);
}

export async function getProjects(): Promise<Project[]> {
  return request<Project[]>('/api/projects');
}

export async function getProject(slug: string): Promise<Project> {
  return request<Project>(`/api/projects/${slug}`);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  return request<{ accessToken: string }>('/api/auth/refresh', { method: 'POST' });
}

export async function logout(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' });
}

export async function getAdminProjects(token: string): Promise<Project[]> {
  return request<Project[]>('/api/admin/projects', {}, token);
}

export async function getAdminProject(id: string, token: string): Promise<Project> {
  return request<Project>(`/api/admin/projects/${id}`, {}, token);
}

export async function createProject(formData: FormData, token: string): Promise<Project> {
  return request<Project>('/api/admin/projects', { method: 'POST', body: formData }, token);
}

export async function updateProject(
  id: string,
  formData: FormData,
  token: string
): Promise<Project> {
  return request<Project>(`/api/admin/projects/${id}`, { method: 'PUT', body: formData }, token);
}

export async function deleteProject(id: string, token: string): Promise<void> {
  await request(`/api/admin/projects/${id}`, { method: 'DELETE' }, token);
}

export { API_URL };
