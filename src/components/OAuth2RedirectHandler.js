import history from "../app-history";
import { getQueryStringParams } from "../util/utility-functions";
import { useEffect } from "react";
import { getUserInSession } from "./services/user-service";
import cookie from "react-cookies";
import { handleError } from "../util/error-handling";

const OAuth2RedirectHandler = () => {

  const str = history.location.search;
  const params = getQueryStringParams(str);

  const getTokenAndLoadUser = (params) => {
    const token = params.token;
    const error = params.error;

    if (token) {
      let expires = new Date();
      expires.setDate(expires.getDate() + 7);
      cookie.save("jwt", token, { path: "/", expires: expires });
      getUserInSession().then(({ response, errorInService }) => {
        if (errorInService) {
          errorInService.statusCode = 401;
          handleError({"error": errorInService})
        } else {
          const currentUser = response;
          cookie.save("current_user", currentUser, {
            path: "/",
            expires: expires,
          });
          history.push("/");
        }
      });
    } else {
      error.statusCode = 401;
      handleError({"error": error});
    }
  }

  useEffect(() => {
    getTokenAndLoadUser(params);
  }, [params])

  return <>Loading</>
}

export default OAuth2RedirectHandler;