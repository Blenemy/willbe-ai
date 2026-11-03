import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, Redirect, Req, UseGuards } from '@nestjs/common';
import { UsersAccountsService } from './users-accounts.service';
import { GoogleAccountsGuard, JwtAuthGuard } from '@willbe-server/shared-auth';
import { 
  ApiFindConnectedAccountsDocs,
  ApiGoogleSignInDocs,
  ApiMicrosoftSignInDocs,
  ApiGoogleRedirectDocs,
  ApiMicrosoftRedirectDocs,
  ApiRemoveUserEmailAccountDocs,
  ApiRemoveUserLinkedinAccountDocs,
  ApiLinkedinSignInDocs,
  ApiLinkedinNotifyDocs
} from '@willbe-server/swagger-docs';
import { appProfileUrl } from '../app-urls';

@Controller('users-accounts')
export class UsersAccountsController {
  constructor(private readonly usersAccountsService: UsersAccountsService) {}

  @ApiFindConnectedAccountsDocs()
  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async findConnectedAccounts(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.usersAccountsService.findConnectedAccounts(userId);
  }
  
  @ApiGoogleSignInDocs()
  @Get(':userId/gmail')
  @UseGuards(JwtAuthGuard)
  async googleSignIn(@Param('userId', ParseUUIDPipe) userId: string) {
    const url = this.usersAccountsService.generateGoogleAuthUrl(userId);
    return { url };
  }

  @Get(':userId/linkedin')
  @UseGuards(JwtAuthGuard)
  @ApiLinkedinSignInDocs()
  async linkedinSignIn(@Param('userId', ParseUUIDPipe) userId: string) {
    const url = await this.usersAccountsService.generateLinkedinUrl(userId);
    return { url };
  }

  @ApiMicrosoftSignInDocs()
  @Get(':userId/outlook')
  @UseGuards(JwtAuthGuard)
  async microsoftSignIn(@Param('userId', ParseUUIDPipe) userId: string) {
    const url = this.usersAccountsService.generateMicrosoftUrl(userId);
    return { url };
  }

  @ApiGoogleRedirectDocs()
  @Get('gmail/redirect')
  @Redirect()
  @UseGuards(GoogleAccountsGuard)
  async googleRedirect(
    @Req() req,
  ) {
    const userId = req.query.state;
    await this.usersAccountsService.connectGmailAccount(
      userId,
      {
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken,
      },
    );
    return { url: appProfileUrl() };
  }

  @Post('linkedin/notify')
  @ApiLinkedinNotifyDocs()
  async linkedinAccountRedirect(
    @Body() body: any,
  ) {
    console.log('linkedin/notify');
    console.log(body);
    return await this.usersAccountsService.connectLinkedinAccount({
      accountId: body.account_id,
      userId: body.name,
    });
  }

  @Get('linkedin/mock-auth')
  @Redirect()
  async linkedinMockAuth(@Query('userId', ParseUUIDPipe) userId: string) {
    const url = await this.usersAccountsService.connectMockLinkedinAccount(userId);
    return { url };
  }

  @ApiRemoveUserEmailAccountDocs()
  @Delete(':userId/email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async removeUserEmailAccount(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.usersAccountsService.removeUserEmailAccount(userId);
  }

  @Delete(':userId/linkedin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiRemoveUserLinkedinAccountDocs()
  async removeUserLinkedinAccount(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.usersAccountsService.removeUserLinkedinAccount(userId);
  }

  @Post('gmail-notify')
  @HttpCode(HttpStatus.OK)
  async gmailNotify(
    @Body() body: any,
    @Headers('x-goog-resource-state') resourceState?: string,
  ) {
    return 'ok';
  }

  @Post('outlook-notify')
  @HttpCode(HttpStatus.OK)
  async outlookNotify(
    @Query() query: any,
    @Body() body: any,
  ) {
    if (query.validationToken) {
      return query.validationToken;
    }

    const data = body.value[0];

    await this.usersAccountsService.outlookNotify(data);

    return;
  }
}