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
    let error2;

    if (token) {
      let expires = new Date();
      expires.setDate(expires.getDate() + 7);
      cookie.save("jwt", token, { path: "/", expires: expires });
      getUserInSession().then(({ response, errorInService }) => {
        if (errorInService) {
          if(errorInService instanceof "string") {
            error2 = {
              statusCode: 401,
              message: errorInService
            };
          }
          else {
            error2 = {
              ...errorInService,
              statusCode: 401
            };
          }
          handleError({"error": error2})
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
      error2 = {
          statusCode: 401, 
          message: error
      };
      handleError({"error": error2});
    }
  }

  useEffect(() => {
    getTokenAndLoadUser(params);
  }, [params])

  return <>Loading</>
}

export default OAuth2RedirectHandler;