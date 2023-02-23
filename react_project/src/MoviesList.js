import axios from "axios"
import { Formik, Form, Field } from "formik"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import StarRating from "./StarRating"

function MoviesList({dodajFilm}) {
    const [movies, setMovies] = useState([])
    const [sortedMovies, setSortedMovies] = useState([])
    const [err, setErr] = useState("")
    const [modal, setModal] = useState(null)

    useEffect(() => {
        axios.get("http://localhost:5000/movies")
        .then(res => {
            setMovies(res.data)
            setSortedMovies(res.data)
        }, 
        rej => {
            setMovies([]);
            setErr("Nie udało się pobrać listy filmów, spróbuj ponownie później")

        })
    }, [])


    const yearValidate = (value) => {
        let error
        let today = new Date()
        let yr = today.getFullYear()

        if (value !== ""){

            if (isNaN(value)) {
                error = "Rok musi być wartością liczbową"
            }
            
            else if (value > yr || value < 1000){
                error = "Podano niepoprawny rok"
            }
        }
        return error

    }

    const deleteMovies = ({checked}) => {
        console.log(checked)
        checked.forEach(id => {
            axios.delete(`http://localhost:5000/movie/${id}`)
            .then(() => {
                setModal(<>
                    <input type="checkbox" id="modal-control" className="modal" />
                        <div>
                            <div className="card">
                                <label htmlFor="modal-control" className="modal-close"></label>
                                <h3 className="section">
                                    Udało się!
                                </h3>
                                <p className="section">Wybrane filmy zostały usunięte</p>
                            </div>
                        </div>
                    </>
            )
            document.getElementById("modal-control").checked = true
        })
    }) 
}

    const filtering = (values) => {
        let movieList = movies
        switch (values.sorting) {
            case 'az':
                movieList.sort((a, b) => (a.title > b.title) ? 1 : -1)
                break;

            case 'za':
                movieList.sort((a, b) => (a.title > b.title) ? -1 : 1)
                break;

            case 'najp':
                movieList.sort((a, b) => (a.rating_count > b.rating_count) ? -1 : 1)
                break;

            case 'najw':
                movieList.sort((a, b) => (a.rating > b.rating) ? -1 : 1)
                break;
            
            default:
                movieList.sort((a, b) => (a.title > b.title) ? 1 : -1)
        }

        if (values.title !== '') {
            movieList = movieList
                .filter((movie) => movie.title.toLowerCase().includes(values.title.toLowerCase()))
        }

        if (values.genre.length !== 0) {
            movieList = movieList.filter(
                (movie) => 
                    values
                    .genre
                    .some(n => movie.genre.split(" / ").includes(n))
                    )
        }

        if (values.yearfrom.length !== 0) {
            movieList = movieList.filter(
                (movie) => 
                    movie.year >= values.yearfrom
            )
        }

        
        if (values.yearto.length !== 0) {
            movieList = movieList.filter(
                (movie) => 
                    movie.year <= values.yearto
            )
        }
        console.log(values)
        return [...movieList]
    }

    return (
        <div className="col-md-12">
            {err}
            <div className="row">
                <div className="col-md-12">
                <Formik
                initialValues={
                    {
                        title: '',
                        sorting: 'az',
                        genre: [],
                        yearfrom: '',
                        yearto: ''
                    }
                }
                onSubmit={
                    (values) => setSortedMovies(filtering(values))
                    }
                    validateOnChange={false}
                    validateOnBlur={false}>

                        {({errors, touched, validateField}) => 
                        
                        
                    <Form>
                        <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <div className="row">
                        <Field name="title" id="title" type="text" placeholder="Tytuł" />
                        </div>
                        <div className="row">
                        <Field name="sorting" as="select">
                            <option value="az">Sortowanie A-Z</option>
                            <option value="za">Sortowanie Z-A</option>
                            <option value="najp">Najpopularniejsze</option>
                            <option value="najw">Najwyżej oceniane</option>
                        </Field>
                        </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                        <label>
                            Rok premiery: <br />
                            <div className="row">
                                Od <Field name="yearfrom" type="text" validate={yearValidate} />
                                {errors.yearfrom && touched.yearfrom ? <label>{errors.yearfrom}</label> : null}
                            </div>
                            <div className="row">
                                Do <Field name="yearto" type="text" validate={yearValidate} />
                                {errors.yearto && touched.yearto ? <label>{errors.yearto}</label> : null}

                            </div>
                        </label>
                        </div>
                        </div>
                        <fieldset>
                        <div className="input-group vertical">
                            <label htmlFor="category-checkbox">Gatunki:</label>
                            <div id="category-checkbox" role="group" aria-labelledby="checkbox-group">
                                <label>
                                    <Field type="checkbox" name="genre" value="Sci-Fi" />
                                    Sci-Fi
                                </label>
                                <label>
                                    <Field type="checkbox" name="genre" value="Akcja" />
                                    Akcja
                                </label>
                                <label>
                                    <Field type="checkbox" name="genre" value="Kryminał" />
                                    Kryminał
                                </label>
                                <label>
                                    <Field type="checkbox" name="genre" value="Dramat" />
                                    Dramat
                                </label>
                                <label>
                                    <Field type="checkbox" name="genre" value="Komedia" />
                                    Komedia
                                </label>
                            </div>               
                        </div>
                        </fieldset>
                        <button className="tertiary col" type="submit" onClick={() => validateField('yearfrom')}>Filtruj</button>
                    </Form>
}
                </Formik>
                </div>
            </div>
            <Formik 
                initialValues={
                    {
                        checked: []
                    }
                }
                onSubmit={values => deleteMovies(values)}>
                    {({values}) => (
                <Form>
                    <button type="submit">
                        <span>{`\uD83D\uDDD1 Usuń: ${values.checked.length}`}</span>
                    </button>
                    <div className="form-group form-check row">
                {sortedMovies.map(movie => {  
                    return(
                        <div className="col-lg-4 col-md-6 col-sm-12 shadowed" key={movie.id}>
                            {console.log(movie.id)}
                            <div className="row">
                            <div className="col-md-6 col-sm-12">
                            <Link to={`/details/${movie.id}`}>
                                <img className="col-md-10 col-sm-6 col-sm-offset-3 col-md-offset-1" src={movie.image_url} alt={`${movie.title} - widok szczegółowy`} />
                            </Link>
                            </div>
                            <div className="col-md-6">
                                <ul>
                                    <li>
                                        Średnia ocen: {parseFloat(movie.rating.toFixed(2))}
                                    </li>
                                    <li>
                                        {movie.rating_count} ocen
                                    </li>
                                    <li>
                                        {movie.genre}
                                    </li>
                                    
                                </ul>
                            </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <StarRating value={Math.round(movie.rating)} rate={(r) => console.log(r)}/>
                                </div>
                            </div>
                            <div className="row">
                            <h4>{movie.title}</h4>
                            </div>
                            <label>
                                <Field type="checkbox" name="checked" value={`${movie.id}`} />
                                Do usunięcia
                            </label>
                            <label>
                                <button type="button" onClick={() => dodajFilm(movie)}>
                                    <span className="icon-bookmark tooltip bottom" aria-label="Dodaj do ulubionych" />
                                </button>
                            </label>
                        </div>
                    )
                })}
                 </div>     
                </Form>
)}
            </Formik>
            {modal}
        </div>
    )
}

export default MoviesList