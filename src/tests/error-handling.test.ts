import * as historyUtil from "../app-history";
import handleError from "../util/error-handling";
import * as cookie from 'react-cookies';

jest.mock('../app-history', () => ({
    __esModule: true,
    ...jest.requireActual('../app-history'),
    push: jest.fn(),
}));

describe('test handleError', () => {
    it(`handleError redirects to conn error page when error has message 'TypeError: Failed to fetch'`, () => {
        const historySpy = jest.spyOn(historyUtil.default, 'push');
        handleError({ error: 'TypeError: Failed to fetch' as any });
        expect(historySpy).toHaveBeenCalledWith('/conn_error',
            expect.objectContaining({ statusCode: 522, message: "Could not reach the server"}));
    });
    it(`handleError redirects to auth error page when error has statusCode 401`, () => {
        const historySpy = jest.spyOn(historyUtil.default, 'push');
        const cookieRemoveSpy = jest.spyOn(cookie, 'remove');
        const error = { message: 'Auth error', statusCode: 401 } as any;
        handleError({ error });
        expect(historySpy).toHaveBeenCalledWith('/auth_error', error);
        expect(cookieRemoveSpy).toHaveBeenCalledWith('jwt', expect.anything());
        expect(cookieRemoveSpy).toHaveBeenCalledWith('current_user', expect.anything());
    });
    it(`handleError redirects to /error for every other error type`, () => {
        const historySpy = jest.spyOn(historyUtil.default, 'push');
        const error = { message: 'Auth error', statusCode: 500 } as any;
        handleError({ error });
        expect(historySpy).toHaveBeenCalledWith('/error', error);
    });
});