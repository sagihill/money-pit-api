import { EntityDetails, MongoTypes } from ".";

// tslint:disable-next-line: no-namespace
export namespace UserTypes {
  export interface IUserService {
    add(request: AddUserRequest): Promise<UserDetails>;
    edit(id: string, request: EditUserRequest): Promise<void>;
    get(id: string): Promise<UserDetails | undefined>;
    remove(id: string): Promise<void>;
    find(query: any): Promise<UserDetails[]>;
    findOne(query: any): Promise<UserDetails | undefined>;
  }

  export interface IUserRepository
    extends MongoTypes.Repository<UserDetails, EditUserRequest> {
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
    password: string;
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
    password: string;
  };
}
