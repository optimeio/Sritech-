// Central API helper for Sri Tech Engineering
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API = BASE + '/api';

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('sritech_token');
    const headers = { ...options.headers };
    if (token && !headers['no-auth']) headers['Authorization'] = `Bearer ${token}`;
    delete headers['no-auth'];

    const res = await fetch(`${API}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({ error: 'Server error' }));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

export function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return BASE + path;
}
