import io from "socket.io-client";

const url = window.location.href.split("/");

export const serverUrl = `${url[0]}//${url[2]}`.replace("3000", "8600");

export const clientUrl =
  window.location.protocol +
  "//" +
  window.location.host +
  "/" +
  window.location.pathname.split("/")[1];

export default io(serverUrl, {
  //@ts-ignore
  withCredentials: true,
});
