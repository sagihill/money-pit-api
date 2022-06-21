import { ID } from "../../lib";
import { SimpleService } from "../../lib/service";
import { UserTypes, LoggerTypes, MongoTypes } from "../../types";

export class UserService
  extends SimpleService<
    UserTypes.UserDetails,
    UserTypes.Requests.AddRequest,
    UserTypes.Requests.UpdateRequest
  >
  implements UserTypes.IUserService
{
  constructor(
    repository: MongoTypes.Repository<
      UserTypes.UserDetails,
      UserTypes.Requests.UpdateRequest
    >,
    logger: LoggerTypes.ILogger
  ) {
    super(repository, logger);
  }
  async getUserInfo(
    request: UserTypes.Requests.GetUserInfoRequest
  ): Promise<UserTypes.UserInfo | undefined> {
    try {
      this.logger.info(`Finding users by: ${{ request }}`);
      const users = await this.repository.find(request, null, 1);
      const user = users[0];
      const { id, accountId, lastName, firstName, email } = user;
      return {
        id,
        accountId,
        firstName,
        lastName,
        email,
      };
    } catch (error: any) {
      this.logger.error(`Can't find users: ${{ request, error }}`);
      throw error;
    }
  }

  async findOne(
    request: UserTypes.Requests.FindRequest
  ): Promise<UserTypes.UserDetails | undefined> {
    try {
      this.logger.info(`Finding users by: ${{ request }}`);
      const users = await this.repository.find(request, null, 1);
      return users[0];
    } catch (error: any) {
      this.logger.error(`Can't find users: ${{ request, error }}`);
      throw error;
    }
  }

  async createValidation(
    request: UserTypes.Requests.AddRequest
  ): Promise<void> {
    await this.logger.info("Not user add validation yet");
  }
  async updateValidation(
    id: string,
    request: UserTypes.Requests.UpdateRequest
  ): Promise<void> {
    await this.logger.info("Not user update validation yet");
  }

  async createEntityDetails(
    request: UserTypes.Requests.AddRequest
  ): Promise<UserTypes.UserDetails> {
    const now = new Date();
    const userDetails: UserTypes.UserDetails = {
      ...request,
      role: UserTypes.UserRole.Regular,
      status: UserTypes.UserStatus.PendingAuthentication,
      id: ID.get(),
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };

    return userDetails;
  }
}
