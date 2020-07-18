import React, { setGlobal } from "reactn";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./Style.scss";

setGlobal({
  user: undefined,
  isMobile: undefined,
  app: undefined,
  snackbar: undefined,
  defaultButton: { icon: undefined, url: undefined, function: undefined },
  navBar: {
    title: undefined,
    backButton: { icon: undefined, url: undefined, function: undefined },
    buttons: {},
  },
  actions: {},
  theme: {
    palette: {
      primary: {
        main: "#0247a1",
      },
      secondary: {
        light: "#0066ff",
        main: "#0044ff",
        contrastText: "#ffcc00",
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
  },
  focusSearch: true
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (window.location.href.match("localhost")) {
  serviceWorker.unregister();
} else {
  serviceWorker.register({
    onUpdate: (registration) => {
      console.log("New client version ready to use!");
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      window.location.reload();
    },
  });
}
