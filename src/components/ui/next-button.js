import Link from "next/link";
import { Button } from "@chakra-ui/react";

function NextButton({ href, ...props }) {
  return (
    <Link href={href} passHref>
      <Button as="a" {...props} />
    </Link>
  );
}

export default NextButton;
