import { LoggerTypes, AuthTypes, UserTypes } from "../../types";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthService implements AuthTypes.IAuthService {
  constructor(
    private readonly userService: UserTypes.IUserService,
    private readonly authRepository: AuthTypes.IAuthRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async signIn(
    request: AuthTypes.SignInRequest
  ): Promise<AuthTypes.SignInResponse> {
    try {
      this.logger.info(`Sign in user`);
      const user = await this.userService.findOne({ email: request.email });
      if (!user) {
        throw new Error("User not found");
      }

      //comparing passwords
      const passwordIsValid = bcrypt.compareSync(
        request.password,
        user.password
      );

      // checking if password was valid and send response accordingly
      if (!passwordIsValid) {
        throw new Error("Invalid password");
      }

      const expiration = 86400;
      //signing token with user id
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.API_SECRET ?? "secret",
        {
          expiresIn: expiration,
        }
      );

      await this.authRepository.save({
        token,
        userId: user.id,
        expiration,
        createdAt: new Date(),
      });

      return { token };
    } catch (error: any) {
      this.logger.error(`Can't signin user: ${{ error }}`);
      throw error;
    }
  }

  async signUp(
    request: AuthTypes.SignUpRequest
  ): Promise<AuthTypes.SignUpResponse> {
    try {
      this.logger.info(`Sign up user`);
      const { firstName, lastName, email } = request;
      const password = bcrypt.hashSync(request.password, 8);
      const userDetails = await this.userService.add({
        firstName,
        lastName,
        email,
        password,
      });

      return { id: userDetails.id };
    } catch (error: any) {
      this.logger.error(`Can't find users: ${{ error }}`);
      throw error;
    }
  }

  async authorize(
    request: AuthTypes.AuthorizeRequest
  ): Promise<AuthTypes.AuthorizeResponse> {
    const response = (await jwt.verify(
      request.token,
      process.env.API_SECRET ?? "secret"
    )) as jwt.JwtPayload;

    const auth = await this.authRepository.get(request.token);

    if (!response || !auth || response.id !== auth.userId) {
      throw new Error("Unauthorized");
    }

    return { isAuthorized: true };
  }

  async getAuth(token: string): Promise<AuthTypes.Auth> {
    const auth = await this.authRepository.get(token);

    if (!auth) {
      throw new Error("Can't find auth");
    }

    return auth;
  }
}
