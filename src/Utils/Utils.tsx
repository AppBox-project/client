export const baseUrl = window.location.href.match("localhost")
  ? "http://localhost:8600"
  : process.env.srvUrl
  ? process.env.srvUrl
  : "/";
