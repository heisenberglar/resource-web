import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import NextLink from "next/link";

export default function BreadCrumb(router) {
  const category = router?.router?.query?.category;
  const article = router?.router?.query?.slug;
  const resource = router?.router?.query?.resource;

  return (
    <Breadcrumb spacing="8px" mb="5">
      <BreadcrumbItem>
        <NextLink href="/" passHref>
          <BreadcrumbLink>Origin</BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>
      {category && (
        <BreadcrumbItem>
          <NextLink href={`/${category}`} passHref>
            <BreadcrumbLink>Category</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
      )}
      {article && (
        <BreadcrumbItem>
          <NextLink href={`/${category}/${article}`} passHref>
            <BreadcrumbLink>Article</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
      )}
      {resource && (
        <BreadcrumbItem>
          <NextLink href={`/${category}/${article}/${resource}`} passHref>
            <BreadcrumbLink>Resource</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}
