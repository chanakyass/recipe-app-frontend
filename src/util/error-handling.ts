import history from "../app-history";
import * as cookie from "react-cookies";
import * as moment from "moment";
import { APICallError } from "../components/services/service.model";

const handleError = ({ error }: { error: APICallError}) => {
  console.log(error);

  if (
    !error.statusCode &&
    error.toString().match(/TypeError: Failed to fetch/gi)
  ) {
    history.push("/conn_error", {
      statusCode: 522,
      message: "Could not reach the server",
      timestamp: moment().format("dddd, MMM Do YYYY"),
    });
  } else if (error.statusCode === 401 || error.statusCode === 403) {
    cookie.remove("jwt", { path: "/" });
    cookie.remove("current_user", { path: "/" });
    history.push("/auth_error", error);
  }
//   else if (
//     error.statusCode === 500 ) {
//   }
  else {
    history.push("/error", error);
  }
};

export default handleError;
