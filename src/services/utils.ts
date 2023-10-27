import * as cookie from 'react-cookies';
import { APICallError } from './service.model';

export const callEndpointAndHandleResult = async <T>(uri: string, method: string, body?: any, ignoreTokenInReq?: boolean, sendTokenInResp?: boolean): Promise<T> => {
  const jwtToken = cookie.load("jwt");
  let headers: Record<string, string> = { 'Content-Type': "application/json" };
  if (!ignoreTokenInReq) {
    headers = { ...headers, Authorization: `Bearer ${jwtToken}` };
  }
  const requestOptions = {
    method,
    headers,
    body,
  };
  try {
    const response = await fetch(uri, requestOptions);

    if (response.status !== 200) {
      const apiCallError: APICallError = await response.json();
      return { response: null, error: apiCallError } as T;
    }

    else {
      const apiResponse = await response.json();
      let resp = { response: apiResponse, error: null } as T;
      if (sendTokenInResp) {
        resp = { ...resp, token: response.headers.get('Authorization') };
      }
      return resp;
    }
  } catch (error) {
    return { response: null, error: error as APICallError } as T;
  }
}