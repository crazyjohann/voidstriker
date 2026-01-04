import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SAVE_FILE = path.join(__dirname, 'save.json');

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/save', (req, res) => {
  try {
    if (!fs.existsSync(SAVE_FILE)) {
      return res.json({ saveData: null });
    }
    const data = JSON.parse(fs.readFileSync(SAVE_FILE, 'utf-8'));
    res.json({ saveData: data });
  } catch (err) {
    console.error('Failed to read save file', err);
    res.status(500).json({ error: 'Unable to load save' });
  }
});

app.post('/api/save', (req, res) => {
  try {
    const { saveData } = req.body;
    if (!saveData || typeof saveData !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    fs.writeFileSync(SAVE_FILE, JSON.stringify(saveData, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to write save file', err);
    res.status(500).json({ error: 'Unable to save' });
  }
});

app.listen(PORT, () => {
  console.log(`VOID STRIKER server running on http://localhost:${PORT}`);
});
