import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ResetPasswordRequest, User, UserAuthProvider, UserScopes } from '@willbe-server/db-core';
import { IJwt } from '@willbe-server/shared-auth';
import bcrypt from 'bcrypt';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { LoginReq, LoginRes } from './dto/login.dto';
import { RefreshTokensReq, RefreshTokensRes } from './dto/refresh-tokens.dto';
import { RegistrationReq, RegistrationRes } from './dto/register.dto';
import { ResetPasswordReq } from './dto/reset-password.dto';
import { CommEmailService } from '@willbe-server/comm';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { async, catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { inspect } from 'node:util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly commService: CommEmailService,
    @InjectModel(ResetPasswordRequest)
    private readonly resetPasswordRequestModel: typeof ResetPasswordRequest,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public async registration(dto: RegistrationReq): Promise<RegistrationRes> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.usersService.createSuperAdmin(dto);
    const tokens = await this.resetUserTokens(user.id);

    return {
      message: 'Super Admin registered',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async login(dto: LoginReq): Promise<LoginRes> {
    const foundUser = await this.validateUser(dto.email, dto.password);
    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    const accessToken = this.generateAccessToken(foundUser.id);
    const refreshToken = this.generateRefreshToken(foundUser.id);
    await this.usersService.updateRefreshToken(foundUser.id, refreshToken);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  public async refreshTokens(dto: RefreshTokensReq): Promise<RefreshTokensRes> {
    const payload = this.verifyRefreshToken(dto.refreshToken);
    // const user = await this.validateRefreshTokenUser(
    //   payload.sub,
    //   dto.refreshToken
    // );
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      message: 'Tokens refreshed',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(
      email,
      UserScopes.WITH_PASSWORD
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private verifyRefreshToken(token: string): IJwt {
    try {
      return this.jwtService.verify<IJwt>(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private async validateRefreshTokenUser(
    userId: string,
    token: string
  ): Promise<User> {
    const user = await this.usersService.findById(
      userId,
      UserScopes.WITH_REFRESH_TOKEN
    );
    if (!user || user.refreshToken !== token) {
      this.logger.warn(`Invalid refresh token for user ID: ${userId}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
    return user;
  }

  async resetUserTokens(userId: string) {
    try {
      const accessToken = this.generateAccessToken(userId);
      const refreshToken = this.generateRefreshToken(userId);

      await this.usersService.updateRefreshToken(userId, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(
        `Failed to reset tokens for user ID: ${userId}`,
        error.stack
      );
      throw new BadRequestException('Failed to reset tokens');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const request = await this.resetPasswordRequestModel.create({
      email,
    });

    await this.commService.sendEmailToken(email, request.id);
    return {
      message: 'Reset password token sent',
    };
  }

  async resetPassword(dto: ResetPasswordReq) {
    const request = await this.resetPasswordRequestModel.findOne({
      where: { id: dto.token },
    });

    const isRequestExpired = Date.now() - new Date(request.createdAt).getTime() >= 30 * 60 * 1000;

    if (!request || isRequestExpired || request.isReset) {
      throw new BadRequestException('This link is not valid');
    }

    const user = await this.usersService.findByEmail(request.email);

    if (!user) {
      throw new BadRequestException('This link is not valid');
    }

    await Promise.all([
      this.usersService.updatePassword(user.id, dto.password),
      await request.update({ isReset: true }),
    ]);

    return { message: 'Password reset successful' };
  }

  async googleSignIn(googleUser: any) {
    const email = googleUser.profile.emails[0].value;
    const { familyName, givenName } = googleUser.profile.name;

    let user = await this.userModel.findOne({
      where: {
        email,
        },
    });

    if (user && user?.authProvider !== UserAuthProvider.GOOGLE) {
      throw new BadRequestException('User already exists');
    }

    if (!user) {
      user = await this.usersService.createSocialMediaSuperAdmin({
        email,
        firstName: givenName,
        lastName: familyName,
        authProvider: UserAuthProvider.GOOGLE,
      });
    }

    const tokens = await this.resetUserTokens(user.id);

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async microsoftSignIn(code: string) {
    const clientId = this.configService.get('MICROSOFT_CLIENT_ID');
    const clientSecret = this.configService.get('MICROSOFT_CLIENT_SECRET');
    const redirectUri = this.configService.get('MICROSOFT_CALLBACK_URL');

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    const tokenRes = await firstValueFrom(
      this.httpService.post(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        params.toString(),
        { headers },
      ).pipe(
       catchError((error) => {
        this.logger.error(error);
        throw new BadRequestException('Unable to login with Microsoft');
       })
      )
    );

    const microsoftAccessToken = tokenRes.data.access_token;

    const userRes = await firstValueFrom(
      this.httpService.get('https://graph.microsoft.com/v1.0/me', {
        headers: { 'Authorization': `Bearer ${microsoftAccessToken}` },
      }).pipe(
        catchError((error) => {
          this.logger.error(error);
          throw new BadRequestException('Unable to login with Microsoft');
        })
       )
    );
    
    const {
      id,
      mail,
      givenName,
      surname,
     } = userRes.data;

    let user = await this.userModel.findOne({
      where: {
        email: mail,
      },
    });

    if (user && user?.authProvider !== UserAuthProvider.MICROSOFT) {
      throw new BadRequestException('User already exists');
    }

    if (!user) {
      user = await this.usersService.createSocialMediaSuperAdmin({
        email: mail,
        firstName: givenName,
        lastName: surname,
        authProvider: UserAuthProvider.MICROSOFT,
      });
    }

    const tokens = await this.resetUserTokens(user.id);

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async linkedinSignIn(code: string) {
    const clientId = this.configService.get('LINKEDIN_CLIENT_ID');
    const clientSecret = this.configService.get('LINKEDIN_CLIENT_SECRET');
    const redirectUri = this.configService.get('LINKEDIN_CALLBACK_URL');

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    const tokenRes = await firstValueFrom(
      this.httpService.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        params.toString(),
        { headers },
      ).pipe(
       catchError((error) => {
        this.logger.error(error);
        throw new BadRequestException('Unable to login with LinkedIn');
       })
      )
    );

    const linkedinAccessToken = tokenRes.data.access_token;

    const userRes = await firstValueFrom(
      this.httpService.get('https://api.linkedin.com/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${linkedinAccessToken}` },
      }).pipe(
        catchError((error) => {
          this.logger.error(error);
          throw new BadRequestException('Unable to login with LinkedIn');
        })
       )
    );
    
    const {
      sub,
      email,
      given_name,
      family_name,
     } = userRes.data;
    
    let user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (user && user?.authProvider !== UserAuthProvider.LINKEDIN) {
      throw new BadRequestException('User already exists');
    }

    if (!user) {
      user = await this.usersService.createSocialMediaSuperAdmin({
        email,
        firstName: given_name,
        lastName: family_name,
        authProvider: UserAuthProvider.LINKEDIN,
      });
    }

    const tokens = await this.resetUserTokens(user.id);

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '5m' });
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '30d' });
  }

  private generateResetPasswordToken(email: string): string {
    return this.jwtService.sign({ email }, { expiresIn: '1d' } )
  }
}
