const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function downloadCsv() {
  //Also check out PapaParser
  //works with PluralSight and Udacity

  const UDACITY_API = "https://catalog-api.udacity.com/v1/courses";
  const PLURALSIGHT_API = "http://api.pluralsight.com/api-v0.9/courses";

  try {
    const target = `http://api.pluralsight.com/api-v0.9/courses`; //file
    //const target = `https://SOME_DOMAIN.com/api/data/log_csv?$"queryString"`; //target can also be api with req.query

    const res = await fetch(target, {
      method: "get",
      headers: {
        "content-type": "text/csv;charset=UTF-8",
        //'Authorization': //in case you need authorisation
      },
    });

    if (res.status === 200) {
      const data = await res.text();
      console.log(data);
    } else {
      console.log(`Error code ${res.status}`);
    }
  } catch (err) {
    console.log(err);
  }
}

export function slugify(text) {
  return text
    .toString() // Cast to string
    .toLowerCase() // Convert the string to lowercase letters
    .normalize("NFD") // The normalize() method returns the Unicode Normalization Form of a given string.
    .trim() // Remove whitespace from both sides of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}
