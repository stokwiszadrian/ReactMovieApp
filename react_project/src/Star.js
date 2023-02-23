import './Star.scss'
function Star({marked, starId}) {
    return(
        <span data-star-id={starId} className="star" role="button">
            {marked ? '\u2605' : '\u2606'}
        </span>
    )
}

export default Star