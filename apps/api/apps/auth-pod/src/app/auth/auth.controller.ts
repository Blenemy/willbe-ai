import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User, UserRole } from '@willbe-server/db-core';
import {
  CurrentUser,
  GoogleAuthGuard,
  JwtAuthGuard,
  LinkedInAuthGuard,
  MicrosoftAuthGuard,
} from '@willbe-server/shared-auth';
import {
  ApiForgotPasswordDocs,
  ApiAuthGoogleSignInDocs,
  ApiAuthLinkedinSignInDocs,
  ApiLoginDocs,
  ApiMeDocs,
  ApiAuthMicrosoftSignInDocs,
  ApiRefreshTokensDocs,
  ApiRegisterDocs,
  ApiResetPasswordDocs,
} from '@willbe-server/swagger-docs';
import { AuthService } from './auth.service';
import { LoginReq, LoginRes } from './dto/login.dto';
import { RefreshTokensReq, RefreshTokensRes } from './dto/refresh-tokens.dto';
import { RegistrationReq, RegistrationRes } from './dto/register.dto';
import { ResetPasswordReq } from './dto/reset-password.dto';
import { UsersAccountsService } from '../users/users-accounts.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthController {
  private authBaseUrlRedirect: string
  constructor(
    private readonly authService: AuthService,
    private readonly usersAccountsService: UsersAccountsService,
    private readonly configService: ConfigService,
  ) {
    this.authBaseUrlRedirect = this.configService.get('AUTH_REDIRECT_BASE_URL');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLoginDocs()
  async login(@Body() dto: LoginReq): Promise<LoginRes> {
    return this.authService.login(dto);
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiRegisterDocs()
  async registration(@Body() dto: RegistrationReq): Promise<RegistrationRes> {
    return this.authService.registration(dto);
  }

  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiRefreshTokensDocs()
  async refreshTokens(
    @Body() dto: RefreshTokensReq
  ): Promise<RefreshTokensRes> {
    return this.authService.refreshTokens(dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiMeDocs()
  async me(@CurrentUser() user: User) {
    const connectedAccounts = await this.usersAccountsService.findConnectedAccounts(user.id);
    return {
      ...user.dataValues,
      accounts: connectedAccounts,
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiForgotPasswordDocs()
  async forgotPassword(@Query('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResetPasswordDocs()
  async resetPassword(@Body() dto: ResetPasswordReq) {
    return this.authService.resetPassword(dto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard) 
  @ApiAuthGoogleSignInDocs()
  async googleSignIn() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.googleSignIn(req.user);

      res.cookie('accessToken', accessToken, { httpOnly: false });
      res.cookie('refreshToken', refreshToken, { httpOnly: false });
      res.cookie('userRole', UserRole.SUPER_ADMIN, { httpOnly: false });
  
      return res.redirect(`${this.authBaseUrlRedirect}/dashboard/home`);
    } catch (error) {
      return res.redirect(`${this.authBaseUrlRedirect}/sign-in?error=user_exists`);
    }
  }

  @Get('linkedin')
  @UseGuards(LinkedInAuthGuard)
  @ApiAuthLinkedinSignInDocs()
  async linkedinSignIn() {}

  @Get('users-accounts/linkedin/redirect')
  async linkedinRedirect(
    @Query('code') code: string,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.linkedinSignIn(code);

      res.cookie('accessToken', accessToken, { httpOnly: false });
      res.cookie('refreshToken', refreshToken, { httpOnly: false });
      res.cookie('userRole', UserRole.SUPER_ADMIN, { httpOnly: false });
  
      return res.redirect(`${this.authBaseUrlRedirect}/dashboard/home`);
    } catch (error) {
      return res.redirect(`${this.authBaseUrlRedirect}/sign-in?error=user_exists`);
    }
  }

  @Get('microsoft')
  @ApiAuthMicrosoftSignInDocs()
  @UseGuards(MicrosoftAuthGuard)
  async microsoftSignIn() {}

  @Get('users-accounts/outlook/redirect')
  async microsoftRedirect(
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    const { code, state } = req.query;

    if (state) {
      return await this.usersAccountsService.connectOutlookAccount(state, code);
    }

    try {
      const { accessToken, refreshToken } =  await this.authService.microsoftSignIn(code);

      res.cookie('accessToken', accessToken, { httpOnly: false });
      res.cookie('refreshToken', refreshToken, { httpOnly: false });
      res.cookie('userRole', UserRole.SUPER_ADMIN, { httpOnly: false });
  
      return res.redirect(`${this.authBaseUrlRedirect}/dashboard/home`);
    } catch (error) {
      return res.redirect(`${this.authBaseUrlRedirect}/sign-in?error=user_exists`);
    }
  }
}
