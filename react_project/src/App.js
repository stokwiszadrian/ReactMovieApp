// import { useEffect, useState } from 'react'
// const axios = require('axios').default
import MoviesList from "./MoviesList"
import MovieForm from "./MovieForm"
import MovieDetails from "./MovieDetails"
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { useState } from 'react'
import FavoriteMovies from "./FavoriteMovies"
function App() {

  const [movies, setMovies] = useState([])
  const dodajFilm = (movie) => {
    if (!movies.includes(movie)) setMovies([...movies, movie])
    console.log(movies)
  }

  const usunFilm = (id) => {
    setMovies(movies.filter(el => el.id !== id))
  }

  return (
    <BrowserRouter >
      <div className="container">

        <div className="row">

        <label htmlFor="drawer-control" className="drawer-toggle"></label>
        <input type="checkbox" id="drawer-control" className="drawer" />

          <nav className="col-md-3">
            <label htmlFor="drawer-control" className="drawer-close"></label>
                <h3><Link to="/">All movies</Link></h3>
                <h3><Link to="/addmovie">Add new movie</Link></h3>
              <br />
            <div className="col-sm-fluid col-md-fluid">
              <FavoriteMovies movies={movies} delete={usunFilm}/>
            </div>
          </nav>

        <div className="col-sm-12 col-md-9">
            <Switch>
              <Route path="/"  exact render={(props) => <MoviesList {...props} dodajFilm={dodajFilm} />}/>
              <Route path="/addmovie" component={MovieForm} />
              <Route path="/editmovie/:movieid" component={MovieForm} />
              <Route path="/details/:movieid" component={MovieDetails} />
              {/* <Route path="/" component={} /> */}
            </Switch> 
        </div>

        
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
