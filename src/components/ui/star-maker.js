import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const starMaker = (rating) => {
  let stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <FontAwesomeIcon icon={faStar} color="gold" size="sm" key={i} />
    );
  }
  return stars;
};

export default starMaker;
