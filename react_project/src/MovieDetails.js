import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import StarRating from './StarRating'
import './MovieDetails.scss'

function MovieDetails() {
    const {movieid} = useParams()
    const history = useHistory()
    const [movie, setMovie] = useState([])
    const [modal, setModal] = useState(null)
    useEffect(() => {
        axios.get(`http://localhost:5000/movie/${movieid}`)
            .then(res => setMovie(res.data))

    }, [movieid])

    const redirect = () => {
        const path = `/editmovie/${movieid}`
        history.push(path, movie)
    }

    const rate = (rating) => {
        axios.patch(`http://localhost:5000/movie/${movie.id}/rate?score=${rating}`)
        .then((res) => {
            console.log("Rating zaktualizowany!", res.data.rating)
            document.getElementById("starrating").ariaLabel = "Oceniono!"
        })
    }

    const deleteMovie = () => {
        axios.delete(`http://localhost:5000/movie/${movie.id}`)
        .then(() => {
            setModal(<>
                <input type="checkbox" id="modal-control" className="modal" />
                    <div>
                        <div className="card">
                            <label htmlFor="modal-control" className="modal-close"></label>
                            <h3 className="section">
                                Udało się!
                            </h3>
                            <p className="section">Film został pomyślnie usunięty</p>
                        </div>
                    </div>
                </>
        )
        document.getElementById("modal-control").checked = true
    })
}
    // Wyświetlenie warunkowe - w przeciwnym wypadku StarRating
    // otrzymuje wartość NaN

    if(movie.length !== 0) {
    return (
        <>
            <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-8 col-sm-offset-2 col-md-offset-0 col-lg-offset-0">
                    <img src={movie.image_url} alt={movie.title} />
                </div>
                    <div className="col-lg-9 col-md-8 cok-sm-8 section">
                        <h2><small>{movie.title}</small></h2>
                        <ul>
                            <li>
                                Średnia ocen: {parseFloat(movie.rating.toFixed(2))}
                            </li>
                            <li>
                                Ilość ocen: {movie.rating_count}
                            </li>
                            <li>
                                Reżyseria: {movie.director}
                            </li>
                            <li>
                                Rok premiery: {movie.year}
                            </li>
                            <li>
                                Gatunek: {movie.genre}
                            </li>
                        </ul>
                    </div>
            </div>
            <div className="row">
                <span id="starrating" className="tooltip bottom col-sm-4 col-md-1" aria-label="Oceń film">
                    <StarRating shouldComponentUpdate={false} value={Math.round(movie.rating)} rate={rate}/>
                </span>
            </div>
            <div className="row">
                <button className="col-md-2 col-sm-fluid primary" onClick={redirect}>
                        <label>Edytuj</label>
                        <span className="icon-edit"></span>
                </button>
                <button className="col-md-2 col-sm-fluid secondary" onClick={deleteMovie}>
                        <label>Usuń</label>
                        <span>{`\uD83D\uDDD1`}</span>
                </button>
            </div>
            <div className="row">
                <p>
                    {movie.description}
                </p>
            </div>
            {modal}
        </>
    )
    }
    else{
        return (<div></div>)
    }
}

export default MovieDetails;