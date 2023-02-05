import { Box, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RatingBox = ({ averageRating }) => {
  const roundedOffRating = (Math.round(averageRating * 10) / 10).toFixed(1);

  if (!Number(roundedOffRating)) return null;

  return (
    <Box
      borderRadius="20px"
      borderColor="highlight"
      borderWidth="1px"
      backgroundColor="black"
      color="white"
      display="flex"
      flexFlow="row"
      maxW="4rem"
      px="12px"
      gap="4px"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="xs">{roundedOffRating}</Text>
      <Box pb="3px">
        <FontAwesomeIcon icon={faStar} size="xs" />
      </Box>
    </Box>
  );
};

export default RatingBox;
