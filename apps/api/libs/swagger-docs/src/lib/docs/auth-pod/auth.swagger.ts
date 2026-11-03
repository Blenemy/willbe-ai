import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '@willbe-server/db-core';

export function ApiLoginDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Login a user' }),
    ApiOkResponse({
      description: 'Successful Response',
      content: {
        'application/json': {
          example: {
            message: 'Login successful',
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'User not found',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid Credentials',
      content: {
        'application/json': {
          example: {
            statusCode: 401,
            message: 'Invalid credentials',
          },
        },
      },
    })
  );
}

export function ApiRegisterDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a super admin user' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Successful Response',
      content: {
        'application/json': {
          example: {
            message: 'Super Admin registered',
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
      content: {
        'application/json': {
          examples: {
            userExists: {
              summary: 'User already exists',
              value: {
                statusCode: 400,
                message: 'User with this email already exists',
              },
            },
            tokenError: {
              summary: 'Token generation failed',
              value: {
                statusCode: 400,
                message: 'Failed to reset tokens',
              },
            },
          },
        },
      },
    })
  );
}

export function ApiRefreshTokensDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access and refresh tokens',
    }),
    ApiOkResponse({
      description: 'Successful Response',
      example: {
        message: 'Tokens refreshed',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      examples: {
        tokenExpired: {
          summary: 'Token expired',
          value: {
            statusCode: 401,
            message: 'Refresh token expired',
          },
        },
        tokenInvalid: {
          summary: 'Token invalid',
          value: {
            statusCode: 401,
            message: 'Refresh token invalid',
          },
        },
        authFailed: {
          summary: 'Authentication failed',
          value: {
            statusCode: 401,
            message: 'Authentication failed',
          },
        },
        noUpdate: {
          summary: 'Unable to update refresh token',
          value: {
            statusCode: 401,
            message: 'Unable to update refresh token',
          },
        },
      },
    })
  );
}

export function ApiMeDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current user details' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: User,
    })
  );
}

export function ApiForgotPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Send reset password token to user' }),
    ApiOkResponse({
      description: 'Reset password token sent',
      content: {
        'application/json': {
          example: {
            message: 'Reset password token sent',
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'User not found',
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    })
  );
}

export function ApiResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset user password' }),
    ApiOkResponse({
      description: 'Password reset successful',
      content: {
        'application/json': {
          example: {
            message: 'Password reset successful',
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid token provided',
      example: {
        message: 'Invalid token',
        error: 'Bad Request',
        statusCode: 400,
      },
    })
  );
}

export function ApiAuthGoogleSignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in with Google' }),
    ApiOkResponse({ description: 'Redirect to Google login page' }),
  );
}

export function ApiAuthLinkedinSignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in with LinkedIn' }),
    ApiOkResponse({ description: 'Redirect to LinkedIn login page' }),
  );
}

export function ApiAuthMicrosoftSignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in with Microsoft' }),
    ApiOkResponse({ description: 'Redirect to Microsoft login page' }),
  );
}
