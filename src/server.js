const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

const pool = new Pool({
  user: 'joshuayeh',
  host: 'localhost',
  database: 'moviesdb',
  password: 'password',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.get('/reviews/:movie_id', async (req, res) => {
  const { movie_id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM reviews WHERE movie_id = $1', [movie_id]);
    res.json(rows);
    console.log('hi');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/reviews', async (req, res) => {
    const { movie_id, rating, review_text } = req.body; // fields we're collecting
    try {
      const queryText = 'INSERT INTO reviews (movie_id, rating, review_text, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *';
      const values = [movie_id, rating, review_text];
      const { rows } = await pool.query(queryText, values);
      res.status(201).json(rows[0]);
      console.log('hello');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
