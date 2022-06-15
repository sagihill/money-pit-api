import { DomainTypes } from ".";

// tslint:disable-next-line: no-namespace
export namespace UserTypes {
  export interface IUserService
    extends DomainTypes.ISimpleService<
      UserDetails,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    findOne(request: Requests.FindRequest): Promise<UserDetails | undefined>;
  }

  export interface UserDetails extends DomainTypes.IEntityDetails {
    id: string;
    accountId?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
  }

  export enum UserRole {
    Regular = "regular",
    Admin = "admin",
  }

  export namespace Requests {
    export interface UpdateRequest {
      accountId?: string;
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
  }
}
