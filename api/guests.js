import { put, list } from '@vercel/blob';

const BLOB_KEY = 'masigabi-guests.json';
const TOKEN = () => process.env.BLOB_READ_WRITE_TOKEN;

async function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

async function readGuests() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token: TOKEN() });
    if (!blobs.length) return [];
    // Fetch the blob URL directly — it's public
    const res = await fetch(blobs[0].downloadUrl || blobs[0].url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function writeGuests(guests) {
  await put(BLOB_KEY, JSON.stringify(guests), {
    access: 'public',
    token: TOKEN(),
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!TOKEN()) return res.status(500).json({ error: 'Storage not configured' });

  if (req.method === 'GET') {
    return res.status(200).json(await readGuests());
  }

  const body = await readBody(req);

  if (req.method === 'POST') {
    const name = (body.name || '').trim().slice(0, 40);
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
    await writeGuests(guests.filter(g => g !== name));
    return res.status(200).json(guests.filter(g => g !== name));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
