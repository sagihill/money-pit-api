import { ID } from "../../lib/common";
import { LoggerTypes, UserTypes } from "../../types";

export class UserService implements UserTypes.IUserService {
  constructor(
    private readonly userRepository: UserTypes.IUserRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async add(request: UserTypes.AddUserRequest): Promise<UserTypes.UserDetails> {
    try {
      this.logger.info(`Creating user : ${{ request }}`);
      const now = new Date();
      const userDetails: UserTypes.UserDetails = {
        ...request,
        uuid: ID.get(),
        deleted: false,
        createdAt: now,
        updatedAt: now,
      };

      return await this.userRepository.add(userDetails);
    } catch (error) {
      this.logger.error(`Can't create new user: ${{ request, error }}`);
      throw error;
    }
  }

  async edit(uuid: string, request: UserTypes.EditUserRequest): Promise<void> {
    try {
      this.logger.info(`Editing user : ${{ uuid, request }}`);
      await this.userRepository.edit(uuid, request);
    } catch (error) {
      this.logger.error(`Can't edit user: ${{ uuid, request, error }}`);
    }
  }

  async get(uuid: string): Promise<UserTypes.UserDetails | undefined> {
    try {
      this.logger.info(`Getting user : ${{ uuid }}`);
      return await this.userRepository.get(uuid);
    } catch (error) {
      this.logger.error(`Can't get user: ${{ uuid, error }}`);
    }
  }

  async remove(uuid: string): Promise<void> {
    try {
      this.logger.info(`Deleting user : ${{ uuid }}`);
      return await this.userRepository.remove(uuid);
    } catch (error) {
      this.logger.error(`Can't remove user: ${{ uuid, error }}`);
    }
  }
}
