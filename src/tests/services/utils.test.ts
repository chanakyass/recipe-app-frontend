import * as serviceUtil from "../../services/utils";
import * as cookieUtil from 'react-cookies';

describe('Test service util methods', () => {
    it('test callEndpointAndHandleResult with ignoreHeaderInToken and sendTokenInResp true', async () => {
        jest.spyOn(cookieUtil, 'load').mockReturnValue('xyz');
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({ message: 'Success' }),
            status: 200,
            headers: { get: jest.fn().mockReturnValue('xyz') }
        });
        const res = await serviceUtil.callEndpointAndHandleResult('xyz', 'POST', {}, true, true);
        expect(global.fetch).toHaveBeenCalledWith('xyz', { method: 'POST', headers: { 'Content-Type': "application/json" }, body: {} });
        expect(res).toStrictEqual({ response: { message: 'Success' }, error: null, token: 'xyz' });
    });

    it('test callEndpointAndHandleResult with ignoreHeaderInToken and sendTokenInResp true and fetch gives 500 error', async () => {
        jest.spyOn(cookieUtil, 'load').mockReturnValue('xyz');
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({ message: 'Failed' }),
            status: 500,
        });
        const res = await serviceUtil.callEndpointAndHandleResult('xyz', 'POST', {}, true, true);
        expect(global.fetch).toHaveBeenCalledWith('xyz', { method: 'POST', headers: { 'Content-Type': "application/json" }, body: {} });
        expect(res).toStrictEqual({ response: null, error: { message: 'Failed' } });
    });

    it('test callEndpointAndHandleResult with ignoreHeaderInToken and sendTokenInResp true and fetch gives 200 response', async () => {
        jest.spyOn(cookieUtil, 'load').mockReturnValue('xyz');
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({ message: 'Success' }),
            status: 200,
        });
        const res = await serviceUtil.callEndpointAndHandleResult('xyz', 'POST', {}, false, false);
        expect(global.fetch).toHaveBeenCalledWith('xyz', {
            method: 'POST',
            headers: { 'Content-Type': "application/json", Authorization: 'Bearer xyz' },
            body: {},
        });
        expect(res).toStrictEqual({ response: { message: 'Success' }, error: null });
    });
});