import { EntityDetails } from ".";

// tslint:disable-next-line: no-namespace
export namespace UserTypes {
  export interface IUserService {
    add(request: AddUserRequest): Promise<UserDetails>;
    edit(id: string, request: EditUserRequest): Promise<void>;
    get(id: string): Promise<UserDetails | undefined>;
    remove(id: string): Promise<void>;
  }

  export interface IUserRepository {
    add(userDetails: UserDetails): Promise<UserDetails>;
    edit(id: string, request: EditUserRequest): Promise<void>;
    get(id: string): Promise<UserDetails | undefined>;
    remove(id: string): Promise<void>;
  }

  export interface UserDetails extends EntityDetails {
    id: string;
    accountId?: string;
    firstName: string;
    lastName: string;
    email: string;
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
