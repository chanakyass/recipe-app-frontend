import * as utilities from '../util/utility-functions';

describe('test all utility functions', () => {
    it('Test convertStringToCapitalCamelCase', () => {
        const res = utilities.convertStringToCapitalCamelCase('testing champ');
        expect(res).toBe('Testing Champ');
    });
    
    it('Test convertDateToReadableFormat', () => {
        const res = utilities.convertDateToReadableFormat('2011-10-05T14:48:00.000');
        expect(res).toContain('05-10-2011');
    });

    it('Test debounced', async () => {
        jest.useFakeTimers();
        const timerSpy = jest.spyOn(global, 'setTimeout');
        const mockFn = jest.fn();
        utilities.debounced(mockFn, 1000, 'xyz');
        expect(timerSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
        jest.runAllTimers();
        expect(mockFn).toHaveBeenCalledWith('xyz');
        jest.useRealTimers();
    });

    it('Test equalsIgnoringCase', () => {
        const res = utilities.equalsIgnoringCase('Dummy', 'dummy');
        expect(res).toBe(true);
    });
})