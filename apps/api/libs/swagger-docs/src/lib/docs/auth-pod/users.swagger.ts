import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { EmailSignature, User } from '@willbe-server/db-core';


export function ApiUpdateUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user data' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: User
      },
    ),
    ApiNotFoundResponse({
      description: 'User not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'User not found',
            },
          },
        },
      },
    ),
  );
}

export function ApiUpdateUserPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user password' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: User
      },
    ),
    ApiNotFoundResponse({
      description: 'User not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'User not found',
            },
          },
        },
      },
    ),
  );
}

export function ApiFindEmailSignatureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find user email signature' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: EmailSignature
      },
    ),
    ApiNotFoundResponse({
      description: 'Email signature not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Email signature not found',
            },
          },
        },
      },
    ),
  );
}

export function ApiUpdateEmailSignatureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user email signature' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: EmailSignature
      },
    ),
    ApiBadRequestResponse({
      description: 'Email signature update failed',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Email signature update failed',
            },
          },
        },
      },
    ),
  );
}
