import { put, head, del } from '@vercel/blob';

const BLOB_FILENAME = 'masigabi-guests.json';

async function readGuests(token) {
  try {
    // Try to fetch existing blob
    const blobInfo = await head(`https://blob.vercel-storage.com/${BLOB_FILENAME}`, { token });
    const res = await fetch(blobInfo.url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function writeGuests(guests, token) {
  await put(BLOB_FILENAME, JSON.stringify(guests), {
    access: 'public',
    token,
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ error: 'Missing BLOB token' });

  if (req.method === 'GET') {
    const guests = await readGuests(token);
    return res.status(200).json(guests);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
    const clean = name.trim().slice(0, 40);
    if (!clean) return res.status(400).json({ error: 'Empty name' });
    const guests = await readGuests(token);
    if (!guests.includes(clean)) {
      guests.push(clean);
      await writeGuests(guests, token);
    }
    return res.status(200).json(guests);
  }

  if (req.method === 'DELETE') {
    const { name, password } = req.body;
    if (password !== 'gabi') return res.status(403).json({ error: 'wrong_password' });
    const guests = await readGuests(token);
    const updated = guests.filter(g => g !== name);
    await writeGuests(updated, token);
    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
