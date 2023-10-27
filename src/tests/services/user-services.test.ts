import * as userApi from '../../services/user-service';
import * as serviceUtils from '../../services/utils';
import userLoginReq from '../mocks/users/mockLoginReq.json';
import userRegisterReq from '../mocks/users/mockRegisterUserReq.json';
import mockUser from '../mocks/users/mockUserRes.json';
import * as cookie from 'react-cookies';

describe('test user service', () => {

    let callEndpointAndHandleResultSpy: jest.SpyInstance;
    let cookieSaveSpy: jest.SpyInstance;

    beforeEach(() => {
        callEndpointAndHandleResultSpy = jest.spyOn(serviceUtils, 'callEndpointAndHandleResult').mockImplementation(jest.fn());
        cookieSaveSpy = jest.spyOn(cookie, 'save').mockImplementation(jest.fn());
    })

    it('test loginUser calls callEndpointAndHandleResult with uri and sets cookie for jwt and current_user', async () => {
        callEndpointAndHandleResultSpy.mockResolvedValue({ response: mockUser, error: null, token: 'xyz' });
        await userApi.loginUser(userLoginReq);
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith('http://localhost:8080/api/v1/public/login', 'POST', JSON.stringify(userLoginReq),  true, true);
        expect(cookieSaveSpy).toHaveBeenCalledWith('jwt', 'xyz', expect.anything());
        expect(cookieSaveSpy).toHaveBeenCalledWith("current_user", mockUser, expect.anything());
    });

    it('test resgisterUser calls callEndpointAndHandleResult with uri', async () => {
        await userApi.registerUser(userRegisterReq);
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith('http://localhost:8080/api/v1/public/register', 'POST', JSON.stringify(userRegisterReq), true);
    });

    it('test getUser calls callEndpointAndHandleResult with uri', async () => {
        await userApi.getUser(123);
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith('http://localhost:8080/api/v1/user/123', 'GET');
    });

    it('test updateUser calls callEndpointAndHandleResult with uri and sets current_user cookie', async () => {
        callEndpointAndHandleResultSpy.mockResolvedValue({ response: mockUser, error: null });
        jest.spyOn(cookie, 'load').mockReturnValue(mockUser);
        await userApi.updateUser(mockUser);
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith(`http://localhost:8080/api/v1/user`, 'PUT', JSON.stringify(mockUser));
        expect(cookieSaveSpy).toHaveBeenCalledWith("current_user", mockUser, expect.anything());
    });

    it('test isValid for various fields', () => {
        let errors: { [key: string]: string } = {};
        let res = userApi.isValid({ ...mockUser, firstName: "" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.firstNameError).toBe("Field can't be empty");

        errors = {};
        res = userApi.isValid({ ...mockUser, lastName: "" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.lastNameError).toBe("Field can't be empty");

        errors = {};
        res = userApi.isValid({ ...mockUser, profileName: "" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.profileNameError).toBe("Field can't be empty");

        errors = {};
        res = userApi.isValid({ ...mockUser, email: "" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.emailError).toBe("Field can't be empty");

        errors = {};
        res = userApi.isValid({ ...mockUser, email: "chan" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.emailError).toBe("Incorrect email format");

        errors = {};
        res = userApi.isValid({ ...mockUser, password: "" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.passwordError).toBe("Field can't be empty");

        errors = {};
        res = userApi.isValid({ ...mockUser, password: "pass" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.passwordError).toBe("Incorrect password format");

        errors = {};
        res = userApi.isValid({ ...mockUser, dob: "" }, errors, 'POST');
        expect(res).toBe(false);
        expect(errors.DOBError).toBe("Field can't be empty");
    });
});