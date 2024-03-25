import { StatusCodes } from 'http-status-codes';

import { User, AuthData, UserCreate } from '../models/userModel';
import { ResponseStatus, ServiceResponse } from '../models/serviceResponse';

import { UserRepository } from '../repositories/user.repository'
import { compareHash, generateHash, generateToken } from '../utils/userHelpers';

export class UserService {
  repository: UserRepository
  userId?: number

  constructor () {
    this.repository = new UserRepository()
  }

  async getAll (): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.repository.getAllUsers();

      if (!users) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User[]>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create({ email, name, password }: UserCreate) {
    if(email?.trim()?.length <= 0 
    || name?.trim()?.length <= 0 
    || password?.trim()?.length <= 0) {
      return new ServiceResponse(ResponseStatus.Failed, 'All fields must be filled in', null, StatusCodes.BAD_REQUEST);
    }

    try {
      const verify = await this.repository.find({
        email: email
      })
  
      if (verify.length > 0) return new ServiceResponse(ResponseStatus.Failed, 'User already exists', null, StatusCodes.CONFLICT);

      const [userId] = await this.repository.create({
        email,
        name,
        password: await generateHash(password)
      });

      if (!userId) {
        return new ServiceResponse(ResponseStatus.Failed, 'Fail created user', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User created', {
        id: userId,
        email,
        name
      }, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error in created user: $${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number) {
    if(!id) {
      return new ServiceResponse(ResponseStatus.Failed, 'User Id cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    try {
      const verify = await this.repository.find({ id });
  
      if (verify.length <= 0) return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);

      await this.repository.delete(id);

      return new ServiceResponse<null>(ResponseStatus.Success, 'User deleted', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error in delete user: $${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async authenticate (data: AuthData): Promise<ServiceResponse<{ user: User, token: any } | null>> {
    try {
      const [user] = await this.repository.find({ email: data.email })

      if (!user) return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.BAD_REQUEST);

      const response = await compareHash(user.password, String(data.password))
      if (!response) return new ServiceResponse(ResponseStatus.Failed, 'Email or password incorrect', null, StatusCodes.FORBIDDEN);

      delete user.password

      return new ServiceResponse<{ user: User, token: any }>(ResponseStatus.Success, 'User found', {
        user,
        token: generateToken(Number(user.id))
      }, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error in authentication user: $${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}