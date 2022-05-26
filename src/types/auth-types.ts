import { IEntityDetails } from ".";

export namespace AuthTypes {
  export interface IAuthService {
    signIn(request: SignInRequest): Promise<SignInResponse>;
    signUp(request: SignUpRequest): Promise<SignUpResponse>;
    authorize(request: AuthorizeRequest): Promise<AuthorizeResponse>;
    getAuth(token: string): Promise<AuthTypes.Auth>;
  }

  export interface IAuthRepository {
    save(auth: Auth): Promise<void>;
    get(token: string): Promise<Auth | undefined>;
  }

  export type SignInRequest = {
    email: string;
    password: string;
  };
  export type SignInResponse = {
    token: string;
  };

  export type SignUpRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  export type SignUpResponse = {
    id: string;
  };

  export type AuthorizeRequest = {
    token: string;
  };

  export type AuthorizeResponse = {
    isAuthorized: boolean;
  };

  export interface Auth {
    token: string;
    userId: string;
    expiration: number;
    createdAt: Date;
  }
}
