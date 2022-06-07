import { LoggerTypes, UserTypes } from "../../types";
import { createNewUserDetails } from "./user-factory";

export class UserService implements UserTypes.IUserService {
  constructor(
    private readonly userRepository: UserTypes.IUserRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async add(request: UserTypes.AddUserRequest): Promise<UserTypes.UserDetails> {
    try {
      this.logger.info(`Creating user : ${{ request }}`);
      const userDetails = createNewUserDetails(request);
      return await this.userRepository.add(userDetails);
    } catch (error) {
      this.logger.error(`Can't create new user: ${{ request, error }}`);
      throw error;
    }
  }

  async edit(id: string, request: UserTypes.EditUserRequest): Promise<void> {
    try {
      this.logger.info(`Editing user : ${{ id, request }}`);
      await this.userRepository.edit(id, request);
    } catch (error) {
      this.logger.error(`Can't edit user: ${{ id, request, error }}`);
      throw error;
    }
  }

  async get(id: string): Promise<UserTypes.UserDetails | undefined> {
    try {
      this.logger.info(`Getting user : ${{ id }}`);
      return await this.userRepository.get(id);
    } catch (error) {
      this.logger.error(`Can't get user: ${{ id, error }}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting user : ${{ id }}`);
      return await this.userRepository.remove(id);
    } catch (error) {
      this.logger.error(`Can't remove user: ${{ id, error }}`);
      throw error;
    }
  }

  async find(query: any): Promise<UserTypes.UserDetails[]> {
    try {
      this.logger.info(`Finding users by: ${{ query }}`);
      return await this.userRepository.find(query);
    } catch (error) {
      this.logger.error(`Can't find users: ${{ query, error }}`);
      throw error;
    }
  }
  async findOne(query: any): Promise<UserTypes.UserDetails | undefined> {
    try {
      this.logger.info(`Finding users by: ${{ query }}`);
      const users = await this.userRepository.find(query, null, 1);
      return users[0];
    } catch (error) {
      this.logger.error(`Can't find users: ${{ query, error }}`);
      throw error;
    }
  }
}