const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const ErrorMessages = require('./error-messages.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

const { Pool } = require('pg');

const client = new Pool ({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432, // podaj port
    database: process.env.PGDB || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.POSTGRES_PASS || 'Q@wertyuiop' // podaj hasło
});


client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL');

    client.query(`CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      title VARCHAR UNIQUE NOT NULL,
      director VARCHAR NOT NULL,
      genre VARCHAR(50) NOT NULL,
      year INT NOT NULL,
      description VARCHAR NOT NULL,
      image_url VARCHAR NULL,
      rating_count INT NULL,
      rating_result INT NULL
    );`);

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Connection error', err.stack));

app.get('/movies', async (req, res) => {
  const result = await client.query("SELECT * FROM movies;");
  const movies = result.rows.map(el => {
      el.rating = el.rating_result ? (el.rating_result / el.rating_count) : null;
      delete el.rating_result;
      return el;
  });

  return res.send(movies);
});

app.get('/movie/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const result = await client.query("SELECT * FROM movies WHERE id = $1", [ id ]);
    const movie = result.rows[0];

    movie.rating = movie.rating_result ? (movie.rating_result / movie.rating_count) : null;
    delete movie.rating_result;
  
    return res.send(movie);
  } catch (ex) {
    return res.status(500).send(ex)
  }
});

app.post('/movie', async (req, res) => {
  try {
    const data = req.body;
    const todayDate = new Date();

    const duplicate = await client.query("SELECT * FROM movies WHERE title = $1", [ data.title ]);

    if (duplicate.rows[0]) {
      return res.status(500).send(ErrorMessages.messages.TITLE_DUPLICATE);
    }

    if (data.year > todayDate.getFullYear() || data.year < 1000) {
      return res.status(500).send(ErrorMessages.messages.INCORRECT_YEAR);
    } else {
      const countPerson = Math.floor(Math.random() * 9) + 1;
      const score = Math.floor(Math.random() * 4) + 1;
      const insertedRow = await client.query("INSERT INTO movies (title, director, genre, year, description, image_url, rating_count, rating_result) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [ data.title, data.director, data.genre, data.year, data.description, data.image_url, countPerson, countPerson * score]);

      insertedRow.rows[0].rating = insertedRow.rows[0].rating_result / insertedRow.rows[0].rating_count;
      delete insertedRow.rows[0].rating_result;

      return res.send(insertedRow.rows[0]); 
    } 
  } catch (ex) {
    return res.status(500).send(ex)
  }
});

app.put('/movie/:id', async (req, res) => {
  const id = +req.params.id;
  const data = req.body;
  const todayDate = new Date();

  const duplicate = await client.query("SELECT * FROM movies WHERE title = $1", [ data.title ]);

  if (duplicate.rows[0] && id !== duplicate.rows[0].id) {
    return res.status(500).send(ErrorMessages.messages.TITLE_DUPLICATE);
  }

  if (data.year > todayDate.getFullYear() || data.year < 1000) {
    return res.status(500).send(ErrorMessages.messages.INCORRECT_YEAR);
  } else {
    const result =  await client.query("UPDATE movies SET title=$1, director=$2, genre=$3, year=$4, description=$5, image_url=$6 WHERE id = $7", 
      [ data.title, data.director, data.genre, data.year, data.description, data.image_url, id ]
    );

    return result.rowCount > 0 ? res.send(data) : res.sendStatus(400);
  }
});

app.delete('/movie/:id', async (req, res) => {
  const id = +req.params.id;
  const response = await client.query("DELETE FROM movies WHERE id = $1", [ id ]);
  
  return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400);
});

app.get('/movie/:id/rate', async (req, res) => {
    const id = +req.params.id;

    const movie = await client.query("SELECT * FROM movies WHERE id = $1", [ id ]);

    if (!movie.rows[0]) {
      return res.status(500).send(ErrorMessages.messages.ELEMENT_NOT_EXIST);
    } else {
      try {  
        const newMovie = {
          id: id,
          rating_count: movie.rows[0].rating_count,
          rating: movie.rows[0].rating_result / movie.rows[0].rating_count
        }
        return res.send(newMovie);
      } catch(ex) {
        return res.status(500).send(ex);
      }
    }
});

app.patch('/movie/:id/rate', async (req, res) => {

  const id = +req.params.id;
  const score = +req.query.score;

  const movie = await client.query("SELECT * FROM movies WHERE id = $1", [ id ]);

  if (!movie.rows[0]) {
    return res.status(500).send(ErrorMessages.messages.ELEMENT_NOT_EXIST);
  } else {
    if (score < 1 || score > 5) {
        return res.status(500).send(ErrorMessages.messages.INCORRECT_RATING_SCORE);
    } else {
      const movieFromDb = movie.rows[0];
      try {
        await client.query("UPDATE movies SET rating_count=$1, rating_result=$2 WHERE id = $3", [movieFromDb.rating_count + 1, movieFromDb.rating_result + score, id]);
        movieFromDb.rating_count = movieFromDb.rating_count + 1;
        movieFromDb.rating = (movieFromDb.rating_result + score) / movieFromDb.rating_count;
        delete movieFromDb.rating_result;
        
        return res.send(movieFromDb);
      } catch(ex) {
        return res.status(500).sendStatus(score);
      }
    }
  }
});