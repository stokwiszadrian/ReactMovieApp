import { useEffect, useState } from "react";
import Star from './Star'
function StarRating({value, rate}) {
    const [clickedRating, setClickedRating] = useState(0)
    const [rating, setRating] = useState(parseInt(value) || 0);
    const [selection, setSelection] = useState(0);

    useEffect(() => {
        if(clickedRating !== 0) rate(Math.round(clickedRating))
    }, [clickedRating, rate])

    const hoverOver = event => {
      let val = 0;
      if (event && event.target && event.target.getAttribute('data-star-id'))
        val = event.target.getAttribute('data-star-id');
      setSelection(val);
    };
    return (
      <div className="col-md-1"
        onMouseOut={() => hoverOver(null)}
        onClick={e => {
            setRating(e.target.getAttribute('data-star-id'))
            setClickedRating(e.target.getAttribute('data-star-id'))
        }}
        onMouseOver={hoverOver}
      >
        {Array.from({ length: 5 }, (v, i) => (
          <Star
            starId={i + 1}
            key={`star_${i + 1}`}
            marked={selection ? selection >= i + 1 : rating >= i + 1}
          />
        ))}
      </div>
    )
  }

  export default StarRating