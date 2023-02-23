import { Link } from 'react-router-dom'
const FavoriteMovies = (props) =>{
    return(
        <>
            <h3>Ulubione filmy:</h3>
            {(props.movies.length !== 0) ?
                props.movies.map(movie => (
                <div className="row" key={movie.id}>
                    <div className="col-md-10 col-sm-10 col-lg-6">
                        <Link to={`/details/${movie.id}`} >
                            <img src={movie.image_url} alt={movie.title} />
                        </Link>
                    </div>
                    <div className="col-md-12 col-sm-12 col-lg-6">
                        <h4>{movie.title}</h4>
                        <ul>
                            <li>
                                Reżyseria: {movie.director}
                            </li>
                            <li>
                                Gatunek: {movie.genre}
                            </li>
                        </ul>
                        <button 
                        className="secondary col-lg-offset-6 col-md-offset-9 col-sm-offset-9" 
                        onClick={() => {
                            props.delete(movie.id)
                            console.log(movie.id)
                            }}>
                                Usuń
                        </button>
                    </div>
                </div>
            ))
        :
        <div className="row">Brak ulubionych filmów</div>}
        </>
    )
}

export default FavoriteMovies