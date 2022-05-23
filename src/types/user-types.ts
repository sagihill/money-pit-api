// tslint:disable-next-line: no-namespace
export namespace UserTypes {
  export interface IUserService {
    add(request: UserTypes.AddUserRequest): Promise<UserTypes.UserDetails>;
    edit(uuid: string, request: UserTypes.EditUserRequest): Promise<void>;
    get(uuid: string): Promise<UserTypes.UserDetails | undefined>;
    remove(uuid: string): Promise<void>;
  }

  export interface IUserRepository {
    add(userDetails: UserTypes.UserDetails): Promise<UserTypes.UserDetails>;
    edit(uuid: string, request: UserTypes.EditUserRequest): Promise<void>;
    get(uuid: string): Promise<UserTypes.UserDetails | undefined>;
    remove(uuid: string): Promise<void>;
  }

  export interface UserDetails {
    uuid: string;
    accountId?: string;
    firstName: string;
    lastName: string;
    email: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface EditUserRequest {
    accountId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }

  export type AddUserRequest = {
    firstName: string;
    lastName: string;
    email: string;
  };
}
