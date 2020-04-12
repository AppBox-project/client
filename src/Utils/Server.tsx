import io from "socket.io-client";

const url = window.location.href.split("/");

export default io(`${url[0]}//${url[2]}`.replace("3000", "8600"));
