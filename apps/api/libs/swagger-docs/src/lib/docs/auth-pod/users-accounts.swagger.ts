import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiOkResponse, 
  ApiNotFoundResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { EmailServiceTokens, EmailServiceType, UserLinkedinAccount } from '@willbe-server/db-core';

class ConnectedAccountsRes {
  @ApiProperty()
  declare linkedin: string | null;

  @ApiProperty({ enum: EmailServiceType })
  declare email: EmailServiceType | null;

  @ApiProperty()
  declare hubspot: boolean;
}

export function ApiFindConnectedAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get connected accounts status' }),
    ApiOkResponse({
      description: 'Connected accounts status',
      type: ConnectedAccountsRes,
    }),
    ApiNotFoundResponse({
      description: 'User not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'User not found'
          }
        }
      }
    })
  );
}

export function ApiGoogleSignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate Google OAuth URL for Gmail connection' }),
    ApiOkResponse({
      description: 'Google authentication URL',
      content: {
        'application/json': {
          example: {
            url: 'https://accounts.google.com/o/oauth2/v2/auth?...'
          }
        }
      }
    }),
  );
}

export function ApiMicrosoftSignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate Microsoft OAuth URL for Outlook connection' }),
    ApiOkResponse({
      description: 'Microsoft authentication URL',
      content: {
        'application/json': {
          example: {
            url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?...'
          }
        }
      }
    }),
  );
}

export function ApiLinkedinSignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate Linkedin auth URL for connection' }),
    ApiOkResponse({
      description: 'Linkedin authentication URL',
      content: {
        'application/json': {
          example: {
            url: 'https://account.unipile.com/...'
          }
        }
      }
    }),
  );
}

export function ApiGoogleRedirectDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Handle Google OAuth redirect and connect Gmail account' }),
    ApiOkResponse({
      description: 'Gmail account connected successfully',
      type: EmailServiceTokens,
    }),
  );
}

export function ApiMicrosoftRedirectDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Handle Microsoft OAuth redirect and connect Outlook account' }),
    ApiOkResponse({
      description: 'Outlook account connected successfully',
      type: EmailServiceTokens,
    }),
  );
}

export function ApiLinkedinNotifyDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Handle Linkedin Unipile notify to receive account id' }),
    ApiOkResponse({
      description: 'Linkedin account connected successfully',
      type: UserLinkedinAccount,
    }),
  );
}

export function ApiRemoveUserEmailAccountDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove user email account connection' }),
    ApiOkResponse({
      description: 'Email account connection removed successfully',
    }),
  );
}

export function ApiRemoveUserLinkedinAccountDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove user Linkedin account connection' }),
    ApiOkResponse({
      description: 'Linkedin account connection removed successfully',
    }),
  );
}

