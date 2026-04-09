// Guest list API — persists to Vercel Blob
// Requires env var: BLOB_READ_WRITE_TOKEN (set in Vercel dashboard → Storage → Blob)
import { put, list } from '@vercel/blob';

const BLOB_KEY = 'masigabi-guests.json';

async function readGuests() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url + '?t=' + Date.now()); // cache-bust
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function writeGuests(guests) {
  await put(BLOB_KEY, JSON.stringify(guests), {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'Storage not configured' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(await readGuests());
  }

  if (req.method === 'POST') {
    const { name } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
    const clean = name.trim().slice(0, 40);
    if (!clean) return res.status(400).json({ error: 'Empty name' });
    const guests = await readGuests();
    if (!guests.includes(clean)) {
      guests.push(clean);
      await writeGuests(guests);
    }
    return res.status(200).json(guests);
  }

  if (req.method === 'DELETE') {
    const { name, password } = req.body || {};
    if (password !== 'gabi') return res.status(403).json({ error: 'wrong_password' });
    const guests = await readGuests();
    const updated = guests.filter(g => g !== name);
    await writeGuests(updated);
    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
