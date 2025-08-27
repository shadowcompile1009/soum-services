import { Constants } from '../../../src/constants/constant';
import { DeltaMachineUser } from '../../../src/models/DeltaMachineUsers';
import { DeltaMachineAuthenticationRepository } from '../../../src/repositories/deltaMachineAuthenticationRepository';
import { getTestingUser } from '../../_data/dmuser';

const deltaMachineAuthenticationRepository =
  new DeltaMachineAuthenticationRepository();
describe('DELETE /rest/api/v1/dm-users/{userId}', () => {
  test('verify user account which has been deleted by agent, can not sign in ', async () => {
    const mockFindOneUser = jest.spyOn(DeltaMachineUser, 'findOne');
    mockFindOneUser.mockImplementation((filterQuery: any) => {
      expect(filterQuery?.username).toEqual('martin');
      return getTestingUser as any;
    });

    const mockGetTestingUser = jest.spyOn(
      deltaMachineAuthenticationRepository,
      'verifyUser'
    );
    mockGetTestingUser.mockImplementation(
      (userName: string, password: string, ip: string) => {
        expect(userName).toEqual('martin');
        expect(password).toEqual('123456');
        expect(ip).toEqual('0.0.0.1');

        return Promise.resolve([
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.INACTIVE_DELETE_USER_ACCOUNT,
            message: Constants.MESSAGE.USER_IS_NOT_FOUND,
          },
        ]);
      }
    );
    const [err, response] =
      await deltaMachineAuthenticationRepository.verifyUser(
        'martin',
        '123456',
        '0.0.0.1'
      );
    expect(err).toBe(true);
    expect(response.code).toBe(Constants.ERROR_CODE.BAD_REQUEST);
    expect(response.result).toBe(
      Constants.ERROR_MAP.INACTIVE_DELETE_USER_ACCOUNT
    );
    expect(response.message).toBe(Constants.MESSAGE.USER_IS_NOT_FOUND);
  });
});
