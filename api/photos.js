const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aqleksrbvrqueaqgsavk.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGVrc3JidnJxdWVhcWdzYXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDg4MjUsImV4cCI6MjA5MjUyNDgyNX0.r2YsdGGc-Rz4rX3p1fIPlTXMGdvAWB7mQNZ5kE7UEL0';
const SIGHTENGINE_USER = process.env.SIGHTENGINE_USER || '431496877';
const SIGHTENGINE_SECRET = process.env.SIGHTENGINE_SECRET || 'KkssebBVNpnSS85MmgXuN9ZkgjEezN46';

const VALID_FRAMES = ['polaroid', 'glitter', 'gold', 'neon', 'retro', 'duck'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const dbHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

async function moderateImage(buffer, mimeType) {
  const form = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  form.append('media', blob, 'photo.jpg');
  form.append('models', 'nudity-2.1,gore,offensive');
  form.append('api_user', SIGHTENGINE_USER);
  form.append('api_secret', SIGHTENGINE_SECRET);

  const res = await fetch('https://api.sightengine.com/1.0/check.json', {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (data.status !== 'success') throw new Error('Moderation API error');

  const nudity = data.nudity?.sexual_activity ?? 0;
  const nudityExplicit = data.nudity?.sexual_display ?? 0;
  const gore = data.gore?.prob ?? 0;
  const offensive = data.offensive?.prob ?? 0;

  const THRESHOLD = 0.5;
  if (nudity > THRESHOLD || nudityExplicit > THRESHOLD || gore > THRESHOLD || offensive > THRESHOLD) {
    return false;
  }
  return true;
}

async function uploadToStorage(buffer, mimeType, filename) {
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  const path = `${Date.now()}-${filename.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/photos/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': mimeType,
      'x-upsert': 'false',
    },
    body: buffer,
  });
  if (!res.ok) throw new Error('Storage upload failed: ' + await res.text());
  return path;
}

async function getPhotos() {
  const [photosRes, votesRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/photos?select=id,uploader,caption,frame,storage_path,created_at&order=created_at.desc&limit=50`, { headers: dbHeaders }),
    fetch(`${SUPABASE_URL}/rest/v1/photo_votes?select=photo_id,vote`, { headers: dbHeaders }),
  ]);
  if (!photosRes.ok) throw new Error(await photosRes.text());
  const rows = await photosRes.json();
  const votes = votesRes.ok ? await votesRes.json() : [];

  // Tally votes per photo
  const tally = {};
  for (const v of votes) {
    if (!tally[v.photo_id]) tally[v.photo_id] = { likes: 0, dislikes: 0 };
    if (v.vote === 1) tally[v.photo_id].likes++;
    else if (v.vote === -1) tally[v.photo_id].dislikes++;
  }

  return rows.map(r => ({
    id: r.id,
    uploader: r.uploader,
    caption: r.caption,
    frame: r.frame,
    url: `${SUPABASE_URL}/storage/v1/object/public/photos/${r.storage_path}`,
    created_at: r.created_at,
    likes: tally[r.id]?.likes || 0,
    dislikes: tally[r.id]?.dislikes || 0,
  }));
}

const ADMIN_PASSWORD = 'gabi';

async function deletePhoto(id, password) {
  if (password !== ADMIN_PASSWORD) return { status: 403 };

  // Fetch storage_path first
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/photos?id=eq.${encodeURIComponent(id)}&select=storage_path`,
    { headers: dbHeaders }
  );
  if (!r.ok) throw new Error(await r.text());
  const rows = await r.json();
  if (!rows.length) return { status: 404 };
  const storagePath = rows[0].storage_path;

  // Delete DB record
  const dbDel = await fetch(
    `${SUPABASE_URL}/rest/v1/photos?id=eq.${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: dbHeaders }
  );
  if (!dbDel.ok) throw new Error(await dbDel.text());

  // Delete from storage (best-effort)
  await fetch(`${SUPABASE_URL}/storage/v1/object/photos/${storagePath}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
  }).catch(() => {});

  return { status: 200 };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      return res.status(200).json(await getPhotos());
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const uploader = (typeof body.uploader === 'string' ? body.uploader : '').trim().slice(0, 40);
      const caption = (typeof body.caption === 'string' ? body.caption : '').trim().slice(0, 100);
      const frame = VALID_FRAMES.includes(body.frame) ? body.frame : 'polaroid';
      const imageData = typeof body.image === 'string' ? body.image : '';

      if (!uploader) return res.status(400).json({ error: 'missing_uploader' });
      if (!imageData) return res.status(400).json({ error: 'missing_image' });

      // Parse base64 data URL
      const match = imageData.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
      if (!match) return res.status(400).json({ error: 'invalid_image_format' });
      const mimeType = match[1];
      const buffer = Buffer.from(match[2], 'base64');

      if (buffer.length > MAX_SIZE_BYTES) return res.status(400).json({ error: 'image_too_large' });

      // Moderate
      const clean = await moderateImage(buffer, mimeType);
      if (!clean) return res.status(400).json({ error: 'nsfw_rejected' });

      // Upload
      const storagePath = await uploadToStorage(buffer, mimeType, uploader);

      // Insert DB record
      const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/photos`, {
        method: 'POST',
        headers: dbHeaders,
        body: JSON.stringify({ uploader, caption, frame, storage_path: storagePath }),
      });
      if (!dbRes.ok) throw new Error(await dbRes.text());

      return res.status(200).json(await getPhotos());
    }

    if (req.method === 'DELETE') {
      const body = req.body || {};
      const id = typeof body.id === 'string' ? body.id : String(body.id || '');
      const password = typeof body.password === 'string' ? body.password : '';
      if (!id) return res.status(400).json({ error: 'missing_id' });
      const result = await deletePhoto(id, password);
      if (result.status === 403) return res.status(403).json({ error: 'wrong_password' });
      if (result.status === 404) return res.status(404).json({ error: 'not_found' });
      return res.status(200).json(await getPhotos());
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('photos handler error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
