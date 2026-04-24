const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aqleksrbvrqueaqgsavk.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGVrc3JidnJxdWVhcWdzYXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDg4MjUsImV4cCI6MjA5MjUyNDgyNX0.r2YsdGGc-Rz4rX3p1fIPlTXMGdvAWB7mQNZ5kE7UEL0';

const ADMIN_PASSWORD = 'gabi';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

async function getMessages() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/messages?select=id,name,text,created_at&order=created_at.asc`,
    { headers }
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows.map(r => ({ id: r.id, name: r.name, text: r.text, ts: new Date(r.created_at).getTime() }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      return res.status(200).json(await getMessages());
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 40);
      const text = (typeof body.text === 'string' ? body.text : '').trim().slice(0, 200);
      if (!name || !text) return res.status(400).json({ error: 'Invalid' });

      const r = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, text }),
      });
      if (!r.ok) throw new Error(await r.text());
      return res.status(200).json(await getMessages());
    }

    if (req.method === 'DELETE') {
      const body = req.body || {};
      const id = typeof body.id === 'string' ? body.id : String(body.id || '');
      const password = typeof body.password === 'string' ? body.password : '';
      if (!id) return res.status(400).json({ error: 'missing_id' });
      if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'wrong_password' });

      const r = await fetch(`${SUPABASE_URL}/rest/v1/messages?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
      });
      if (!r.ok) throw new Error(await r.text());
      return res.status(200).json(await getMessages());
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('messages handler error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
