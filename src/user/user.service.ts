import { Service } from '@utils';
import userModel from './user.model';
import type { CreateUserDTO, UpdateUserDTO, UserDocument } from './user.types';

export default class UserService extends Service<UserDocument, CreateUserDTO, UpdateUserDTO> {
  constructor() {
    super(userModel);
  }
}
