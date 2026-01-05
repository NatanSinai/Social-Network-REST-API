import { envVar, Service } from '@utils';
import { hashSync } from 'bcrypt';
import userModel from './user.model';
import type { CreateUserDTO, UpdateUserDTO, UserDocument } from './user.types';

export default class UserService extends Service<UserDocument, CreateUserDTO, UpdateUserDTO> {
  constructor() {
    super(userModel);
  }

  createSingle({ password: rawPassword, ...createUserDTO }: CreateUserDTO) {
    const { PASSWORD_HAS_SALT_ROUNDS } = envVar;

    const hashedPassword = hashSync(rawPassword, PASSWORD_HAS_SALT_ROUNDS);

    return super.createSingle({ password: hashedPassword, ...createUserDTO });
  }
}
