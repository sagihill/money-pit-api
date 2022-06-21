import { DomainTypes } from ".";
import { ValidationError } from "../errors/service-error";

// tslint:disable-next-line: no-namespace
export namespace UserTypes {
  export interface IUserService
    extends DomainTypes.ISimpleService<
      UserDetails,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    findOne(request: Requests.FindRequest): Promise<UserDetails | undefined>;
    getUserInfo(
      request: Requests.GetUserInfoRequest
    ): Promise<UserInfo | undefined>;
  }

  export interface UserDetails extends DomainTypes.IEntityDetails {
    id: string;
    accountId?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
  }
  export interface UserInfo {
    id: string;
    accountId?: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  export enum UserRole {
    Regular = "regular",
    Admin = "admin",
  }

  export enum UserStatus {
    Authenticated = "authenticated",
    PendingAuthentication = "pending_authentication",
    Blocked = "blocked",
  }

  export namespace Requests {
    export interface UpdateRequest {
      accountId?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    }
    export interface UpdateUserDetailsRequest {
      firstName?: string;
      lastName?: string;
      email?: string;
    }

    export type AddRequest = {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };

    export type FindRequest = {
      email?: string;
    };

    export type GetUserInfoRequest = {
      id: string;
    };
  }

  export class UserNotFound extends ValidationError {
    constructor() {
      super(`Can't finish operation, User not found.`);
    }
  }
}
