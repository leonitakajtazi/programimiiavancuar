// user-profile-service/server.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(express.json());

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// ===== ROUTES =====
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-profile-service' });
});

app.post('/users', async (req, res) => {
  const { email, password, name, address } = req.body;
  if (!email || !password || !name || !address) return res.status(400).json({ error: 'All fields are required' });

  const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();
  if (existingUser) return res.status(400).json({ error: 'Email already in use' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    address,
    registrationDate: new Date().toISOString(),
    lastLogin: null,
  };

  const { error } = await supabase.from('users').insert(newUser);
  if (error) return res.status(500).json({ error: 'Failed to create user' });

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    address: newUser.address,
    registrationDate: newUser.registrationDate,
  });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

  await supabase.from('users').update({ lastLogin: new Date().toISOString() }).eq('id', user.id);

  res.status(200).json({ token, userId: user.id });
});

app.get('/users/me', authenticateToken, async (req, res) => {
  const { data: user } = await supabase.from('users').select('*').eq('id', req.user.id).single();
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    registrationDate: user.registrationDate,
    lastLogin: user.lastLogin,
  });
});

app.put('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  if (req.user.id !== id) return res.status(403).json({ error: 'Unauthorized' });

  const updates = {};
  if (name) updates.name = name;
  if (address) updates.address = address;

  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: 'Failed to update user' });

  res.status(200).json(data);
});

app.delete('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).json({ error: 'Unauthorized' });

  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) return res.status(500).json({ error: 'Failed to delete user' });

  res.status(200).json({ message: 'User deleted successfully' });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the User Profile Service!' });
});

app.listen(PORT, () => {
  console.log(`User Profile Service running on port ${PORT}`);
});
