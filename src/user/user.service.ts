import { envVar, Service } from '@utils';
import { compareSync, hashSync } from 'bcrypt';
import userModel from './user.model';
import type { CreateUserDTO, UpdateUserDTO, UserCredentials, UserDocument } from './user.types';

export default class UserService extends Service<UserDocument, CreateUserDTO, UpdateUserDTO> {
  constructor() {
    super(userModel);
  }

  createSingle({ password: rawPassword, ...createUserDTO }: CreateUserDTO) {
    const { PASSWORD_HASH_SALT_ROUNDS } = envVar;

    const hashedPassword = hashSync(rawPassword, PASSWORD_HASH_SALT_ROUNDS);

    return super.createSingle({ password: hashedPassword, ...createUserDTO });
  }

  getOneByCredentials = async ({ username, password }: UserCredentials) => {
    const user = await this.getOne({ username });

    if (!user) return { user: null, errorMessage: 'Invalid username' } as const;

    const isPasswordsMatch = compareSync(password, user.password);

    if (!isPasswordsMatch) return { user: null, errorMessage: 'Invalid password' } as const;

    return { user, errorMessage: '' } as const;
  };
}
