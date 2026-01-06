import { Service } from '@utils';
import type { ObjectId } from 'mongoose';
import userRefreshTokenModel from './userRefreshToken.model';
import type {
  CreateUserRefreshTokenDTO,
  UpdateUserRefreshTokenDTO,
  UserRefreshToken,
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

  validateUserRefreshTokenToken = async ({
    userId,
    refreshToken,
  }: Pick<UserRefreshToken, 'refreshToken'> & { userId: ObjectId }) => {
    const userToken = await this.getOne({ userId });

    if (userToken) await this.deleteById(userToken._id);

    await this.createSingle({ userId, refreshToken });
  };
}
