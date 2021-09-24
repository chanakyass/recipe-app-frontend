import history from "../app-history";
//import { baseURI } from "../util/api-config";
import { getQueryStringParams } from "../util/utility-functions";
import { useEffect } from "react";
import { getUserInSession } from "./services/user-service";
import cookie from "react-cookies";

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
      getUserInSession().then(({ response, error }) => {
        if (error) {
          console.log(error);
        } else {
          const currentUser = response;
          cookie.save("current_user", currentUser, {
            path: "/",
            expires: expires,
          });
          history.push("/")
        }
      });
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    getTokenAndLoadUser(params);
  }, [params])

  return <>Loading</>
}

export default OAuth2RedirectHandler;