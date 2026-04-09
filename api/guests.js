import { put } from '@vercel/blob';

// Fixed blob URL — no list() call needed, avoids CDN-cached metadata
const BLOB_URL = 'https://qjyxqnzcycw1l7dp.public.blob.vercel-storage.com/masigabi-guests.json';
const BLOB_KEY = 'masigabi-guests.json';

async function readGuests() {
  try {
    // ?download=1 is the downloadUrl form — bypasses CDN content cache
    const res = await fetch(BLOB_URL + '?download=1&t=' + Date.now(), {
      cache: 'no-store',
      headers: { 'Pragma': 'no-cache' },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error('readGuests error:', e);
    return [];
  }
}

async function writeGuests(guests) {
  await put(BLOB_KEY, JSON.stringify(guests), {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ error: 'Storage not configured' });

  try {
    if (req.method === 'GET') {
      return res.status(200).json(await readGuests());
    }

    const body = req.body || {};

    if (req.method === 'POST') {
      const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 40);
      if (!name) return res.status(400).json({ error: 'Invalid name' });
      const guests = await readGuests();
      if (!guests.includes(name)) {
        guests.push(name);
        await writeGuests(guests);
      }
      return res.status(200).json(guests);
    }

    if (req.method === 'DELETE') {
      const { name, password } = body;
      if (password !== 'gabi') return res.status(403).json({ error: 'wrong_password' });
      const guests = await readGuests();
      const updated = guests.filter(g => g !== name);
      await writeGuests(updated);
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('handler error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
