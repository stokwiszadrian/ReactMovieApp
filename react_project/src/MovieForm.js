import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Formik, Field, Form } from 'formik'

function MovieForm(){
    const location = useLocation()
    const [movieInfo, setMovieInfo] = useState({
        title: '',
        director: '',
        genre: '',
        year: '',
        description: '',
        image_url: ''
    })
    const [formTitle, setFormTitle] = useState("")
    const [modal, setModal] = useState(null)
    // funkcja wysyłająca request dodający film

    const postmovie = (values) => {
        const genres = values.genre.join(" / ")
        const add = {
            title: values.title,
            director: values.director,
            genre: genres,
            year: values.year,
            description: values.description,
            image_url: values.image_url

        }
        axios.post("http://localhost:5000/movie", add)
        .then(res => {
            console.log(res)
            setModal(<>
                <input type="checkbox" id="modal-control" className="modal" />
                    <div>
                        <div className="card">
                            <label htmlFor="modal-control" className="modal-close"></label>
                            <h3 className="section">
                                Udało się!
                            </h3>
                            <p className="section">Film został dodany</p>
                        </div>
                    </div>
                </>
            )
            document.getElementById("modal-control").checked = true
        }, rej => {
            console.log(rej.response)
            setModal(<>
                <input type="checkbox" id="modal-control" className="modal" />
                    <div>
                        <div className="card">
                            <label htmlFor="modal-control" className="modal-close"></label>
                            <h3 className="section">
                                Wystąpił błąd
                            </h3>
                            <p className="section">{rej.response.data === "INCORRECT_YEAR" ? "Rok jest niepoprawny" : "Nazwa już występuje w bazie"}</p>
                        </div>
                    </div>
                </>
            )
            document.getElementById("modal-control").checked = true
        })
    }
    
    // funkcja wysyłająca request do edycji filmu
    const putmovie = (values) => {
        const genres = values.genre.join(" / ")
        const add = {
            title: values.title,
            director: values.director,
            genre: genres,
            year: values.year,
            description: values.description,
            image_url: values.image_url

        }
        axios.put(`http://localhost:5000/movie/${location.state.id}`, add)
            .then(res => {
                console.log(res)
                setModal(<>
                    <input type="checkbox" id="modal-control" className="modal" />
                        <div>
                            <div className="card">
                                <label htmlFor="modal-control" className="modal-close"></label>
                                <h3 className="section">
                                    Udało się!
                                </h3>
                                <p className="section">Dane filmu zostały pomyślnie zaktualizowane</p>
                            </div>
                        </div>
                    </>
                )
                document.getElementById("modal-control").checked = true
            }, rej => {
                console.log(rej)
                setModal(<>
                    <input type="checkbox" id="modal-control" className="modal" />
                        <div>
                            <div className="card">
                                <label htmlFor="modal-control" className="modal-close"></label>
                                <h3 className="section">
                                    Wystąpił błąd
                                </h3>
                                <p className="section">Film o danym tytule już znajduje się w bazie</p>
                            </div>
                        </div>
                    </>
                )
                document.getElementById("modal-control").checked = true
            })
    }

    // funkcja określająca "kierunek" zapytania

    const submitFunc = (values) => {
        if(location.pathname === "/addmovie") {
            postmovie(values)
        }
        else {
            putmovie(values)
        }
    }


    // przygotowanie danych początkowych forma
    // zależnie od przeznaczenia
    useEffect(() => {
        if(!location.state){
            let values = {
                title: '',
                director: '',
                genre: [],
                year: '',
                description: '',
                image_url: ''
            }
            console.log("dane puste")
            setMovieInfo(values)
            setFormTitle("Dodaj nowy film")
        }
        else {
            let values = {
                title: location.state.title,
                director: location.state.director,
                genre: location.state.genre.split(" / "),
                year: location.state.year,
                description: location.state.description,
                image_url: location.state.image_url
            }
            console.log("Ustawiono dane")
            setMovieInfo(values)
            setFormTitle("Edytuj film")
        }
    }, [location])

    const validate = values => {
        let errors = {}
        let today = new Date()
        if (!values.title) {
            errors.title = "Pole tytuł jest wymagane"
        }
        if (!values.director) {
            errors.director = "Pole reżyser jest wymagane"
        }
        else if(!/^[A-Z', ]{2,}$/i.test(values.director)) {
            errors.director = "Proszę wpisać poprawne imie reżysera"
        }
        if (values.genre.length === 0) {
            errors.genre = "Wymagany jest co najmniej 1 gatunek"
        }
        else if(values.genre.length > 3){
            errors.genre = "Proszę wybrać maksymalnie 3 gatunki"
        }
        if (!values.year) {
            errors.year = "Pole rok wydania jest wymagane"
        }
        else if(isNaN(values.year)){
            errors.year = "Pole rok musi zawierać wartość liczbową"
        }
        // else if(values.year < 1000 || values.year > today.getFullYear() ){
        //     errors.year = "Proszę podać poprawny rok"
        // }
        
        if (!values.description) {
            errors.description = "Pole opis jest wymagane"
        }
        return errors
    }

    return (
        
        <div className="col-md">
            <Formik 
                initialValues={movieInfo}
                onSubmit={(values) => submitFunc(values)}
                enableReinitialize={true}
                validate={validate}
                validateOnChange={false}
                validateOnBlur={false}
                >
                {({errors, touched, values}) => (
                    <Form>
                        <fieldset>

                            <legend className="doc">{formTitle}</legend>
                        <div className="row responsive-label">
                            <div className="col-sm-12 col-md-3">
                                <label className="doc" htmlFor="form-title">Tytuł:</label>
                            </div>
                            <div className="col-sm-12 col-md">
                                <Field name="title" type="text" id="form-title" className="doc"></Field>
                             </div>
                        </div>

                        <div className="row responsive-label">
                            <div className="col-sm-12 col-md-3">
                                <label className="doc" htmlFor="form-director">Reżyser:</label>
                            </div>
                            <div className="col-sm-12 col-md">
                                <Field name="director" type="text" id="form-director" className="doc"></Field>
                            </div>
                        </div>

                        <div className="row responsive-label">
                            <div className="col-sm-12 col-md-3">
                                <label className="doc">Gatunki:</label>
                            </div>
                            <div className="col-sm-12 col-md">
                                <div className="form-group form-check">
                                    <div className="col-sm-6 col-md-6">
                                        <label htmlFor="form-checkbox-dramat">Dramat</label>
                                        <Field id="form-checkbox-dramat" name="genre" type="checkbox" value="Dramat" />
                                    </div>
                                    <div className="col-sm-6 col-md-6">
                                        <label htmlFor="form-checkbox-kryminal">Kryminał</label>
                                        <Field id="form-checkbox-kryminal" name="genre" type="checkbox" value="Kryminał" />
                                    </div>
                                    <div className="col-sm-6 col-md-6">
                                        <label htmlFor="form-checkbox-scifi">ScienceFiction</label>
                                        <Field id="form-checkbox-scifi" name="genre" type="checkbox" value="Sci-Fi" />
                                    </div>
                                    <div className="col-sm-6 col-md-6">
                                        <label htmlFor="form-checkbox-komedia">Komedia</label>
                                        <Field id="form-checkbox-komedia" name="genre" type="checkbox" value="Komedia" />
                                     
                                    </div>
                                    <div className="col-sm-6 col-md-6">
                                        <label htmlFor="form-checkbox-akcja">Akcja</label>
                                        <Field id="form-checkbox-akcja" name="genre" type="checkbox" value="Akcja" />
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row responsive-label">
                            <div className="col-sm-12 col-md-3">
                                <label className="doc">Rok wydania:</label>
                            </div>
                            <div className="col-sm-12 col-md">
                                <Field name="year" type="text"></Field>
                            </div>
                        </div>

                        <div className="row responsive-label">
                            <div className="col-sm-12 col-md-3">
                                <label className="doc">Opis</label>
                            </div>
                            <div className="col-sm-12 col-md">
                                <Field className="doc" name="description" type="text" as="textarea"></Field>
                            </div>
                        </div>

                        <div className="row responsive-label">
                            <div className="col-sm-12 col-md-3">
                                <label className="doc">Obraz (wklej link do grafiki):</label>
                            </div>
                            <div className="col-sm-12 col-md">
                                <Field name="image_url" type="text"></Field>
                            </div>
                            <div className="col-sm-12 col-md-3">
                                <label>Podgląd obrazka:</label>
                                <img src={values.image_url} alt="obrazek" />
                            </div>
                        </div>
                        {Object.keys(errors).length !== 0 ?
                        (<div className="row">
                            <div className="card error">
                                {errors.title && touched.title ? 
                                <div className="row">{errors.title}</div>
                                : null}
                                {errors.director && touched.director ? 
                                <div className="row">{errors.director}</div>
                                : null}
                                {errors.genre && touched.genre ? 
                                <div className="row">{errors.genre}</div>
                                : null}
                                {errors.year && touched.year ? 
                                <div className="row">{errors.year}</div>
                                : null}
                                {errors.description && touched.description ? 
                                <div className="row">{errors.description}</div>
                                : null}
                                {console.log(errors)}
                            </div>
                        </div>)
                        : console.log(errors)
                        }
                        
                        {modal}
                        <button type="submit">Dodaj</button>
                        </fieldset>
                    </Form>
                    )}
            </Formik>
        </div>
    )
}

export default MovieForm;