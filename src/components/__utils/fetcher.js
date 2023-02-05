export const fetcherWithToken = (url, token) =>
  fetch(url, { headers: { Authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default fetcher;
