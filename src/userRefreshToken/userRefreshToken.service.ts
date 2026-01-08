import { Service } from '@utils';
import userRefreshTokenModel from './userRefreshToken.model';
import type {
  CreateUserRefreshTokenDTO,
  UpdateUserRefreshTokenDTO,
  UserRefreshTokenDocument,
} from './userRefreshToken.types';

export default class UserRefreshTokenService extends Service<
  UserRefreshTokenDocument,
  CreateUserRefreshTokenDTO,
  UpdateUserRefreshTokenDTO
> {
  constructor() {
    super(userRefreshTokenModel);
  }

  createSingle = async ({ userId, refreshToken }: CreateUserRefreshTokenDTO) => {
    const userToken = await super.getOne({ userId });

    if (userToken) await super.deleteById(userToken._id);

    const newUserRefreshToken = await super.createSingle({ userId, refreshToken });

    return newUserRefreshToken;
  };
}
