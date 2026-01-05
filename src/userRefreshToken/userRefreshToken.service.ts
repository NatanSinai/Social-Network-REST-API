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
}
