import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Invitation, User } from '@willbe-server/db-core';

export function ApiFindAllUsersForCompanyDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all users for company' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: User,
      isArray: true,
    }),
    ApiNotFoundResponse({
      description: 'Comapny not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Comapny not found',
          },
        },
      },
    }),
  );
}

export function ApiCreateInvitationDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create invitation' }),
    ApiCreatedResponse({
      description: 'Successful Response',
      type: Invitation,
    }),
    ApiBadRequestResponse({
      description: 'Invitation already exists for given email',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Invitation already exists for given email',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'User with this email already exists',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'User with this email already exists',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invitation creation error',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to create an invitation',
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Comapny not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Comapny not found',
          },
        },
      },
    })
  );
}

export function ApiFindInvitationByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find invitation by ID' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: Invitation,
    }),
    ApiNotFoundResponse({
      description: 'Invitation not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Invitation not found',
          },
        },
      },
    }),
  );
}

export function ApiAcceptInvitationDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Accept invitation' }),
    ApiCreatedResponse({
      description: 'Successful Response',
      type: User,
    }),
    ApiBadRequestResponse({
      description: 'Invitation already accepted',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Invitation already accepted',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Accept invitation error',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to accept an invitation',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Creation user error',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to create user',
          },
        },
      },
    }),
  );
}

export function ApiUpdateCompanyUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update company user' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: User,
    }),
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
    }),
    ApiBadRequestResponse({
      description: 'Update user error',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to update user',
          },
        },
      },
    }),
  );
}

export function ApiRemoveCompanyUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove user' }),
    ApiNoContentResponse({
      description: 'User successfully removed',
    }),
  );
}
