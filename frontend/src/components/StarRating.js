import React, { Fragment } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

export const StarDisplay = ({ num, size = 25, selected = true }) => {
  return (
    <>
      {[...Array(num)].map((i, index) => (
        <Fragment key={index}>
          {selected
            ? <FaStar data-testid="filled" role="img" color={"#ff4400"} className="star-display" size={size} />
            : <FaStar data-testid="filled" role="img" color={"#ffb295"} className="star-display" size={size} />
          }
        </Fragment>

      ))}
      {[...Array(5 - num)].map((i, index) => (
        <Fragment key={index}>
          {selected
            ? <FaRegStar data-testid="hollow" role="img" color={"#ff4400"} className="star-display" size={size} />
            : <FaRegStar data-testid="hollow" role="img" color={"#ffb295"} className="star-display" size={size} />
          }
        </Fragment>
      ))}
    </>
  );
};

export const StarIcon = ({
  index,
  rating,
  hoverRating,
  onMouseEnter,
  onMouseLeave,
  onSaveRating,
}) => {

  const fill = React.useMemo(() => {
    if (hoverRating >= index) {
      return true;
    } else if (!hoverRating && rating >= index) {
      return true;
    }
    return false;
  }, [rating, hoverRating, index]);

  return (
    <div
      data-testid="star"
      className="cursor-pointer"
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={() => onMouseLeave()}
      onClick={() => onSaveRating(index)}>
      {fill
        ? <FaStar data-testid="filled" role="application" color={"#ff4400"} className="star-choice" size={30} />
        : <FaRegStar data-testid="hollow" role="application" color={"#ff4400"} className="star-choice" size={30} />
      }
    </div>
  )
}

export const StarChoice = ({ rating, setRating }) => {
  // const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const onMouseEnter = (index) => {
    setHoverRating(index);
  };
  const onMouseLeave = () => {
    setHoverRating(0);
  };
  const onSaveRating = (index) => {
    setRating(index);
  };
  return (
    <div className="rating-div">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <StarIcon
            key={index}
            index={index}
            rating={rating}
            hoverRating={hoverRating}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onSaveRating={onSaveRating} />
        )
      })}
    </div>
  );
}