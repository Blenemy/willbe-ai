import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { AccountScenarioModel, FindAccountsRes, SavedAccount } from '@willbe-server/db-core';

export class SaveAccountsReq {
  @ApiProperty({
    type: FindAccountsRes,
    isArray: true,
  })
  declare accounts: FindAccountsRes[];
}

export function ApiCreateAccountScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create account scenario' }),
    ApiCreatedResponse({
      description: 'Successful Response',
      type: AccountScenarioModel,
    }),
    ApiBadRequestResponse({
      description: 'Unable to create account scenario',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to create account scenario',
          },
        },
      },
    }),
  );
}

export function ApiFindAllAccountScenariosDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all account scenarios' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: AccountScenarioModel,
      isArray: true,
    }),
  );
}

export function ApiFindAccountScenarioByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find account scenario by ID' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: AccountScenarioModel,
    }),
    ApiNotFoundResponse({
      description: 'Account scenario not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Account scenario not found',
          },
        },
      },
    }),
  );
}

export function ApiUpdateAccountScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update account scenario' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: AccountScenarioModel,
    }),
    ApiNotFoundResponse({
      description: 'Account scenario not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Account scenario not found',
          },
        },
      },
    }),
  );
}

export function ApiRemoveAccountScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove account scenario' }),
    ApiNoContentResponse({
      description: 'Successful Response',
    }),
  );
}

export function ApiFindAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find accounts' }),
    ApiOkResponse({
      description: 'List of accounts',
      type: FindAccountsRes,
      isArray: true,
    }),
    ApiBadRequestResponse({
      description: 'Unable to find accounts',
    }),
  );
}

export function ApiSaveAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Save accounts' }),
    ApiBody({ type: SaveAccountsReq }),
    ApiCreatedResponse({
        description: 'List of saved accounts',
        type: SaveAccountsReq,
      },
    ),
    ApiNotFoundResponse({
      description: 'Account scenario not found',
      },
    ),
    ApiBadRequestResponse({
      description: 'Unable to save accounts',
      },
    ),
  );
} 

export function ApiFindSavedAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find saved accounts' }),
    ApiOkResponse({
        description: 'List of saved accounts',
        type: SavedAccount,
        isArray: true,
      },
    ),
  );
}

export class SavedAccountDto {
  @ApiProperty({ example: 'f47ac4ae-aec7-42a1-8e71-eaa6864b3cde', description: 'Saved account ID' })
  id: string = '';

  @ApiProperty({ 
    example: {
      id: '164462',
      logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFpXEye2YOqcQ/company-logo_400_400/company-logo_400_400/0/1680305280663',
      name: 'IPsoft',
      type: 'COMPANY',
      summary: 'IPsoft Digital is a leading Decision AI company...',
      industry: 'IT Services and IT Consulting',
      location: null,
      headcount: '534',
      profile_url: 'https://www.linkedin.com/sales/company/164462'
    },
    description: 'Account data object'
  })
  accountData: Record<string, any> = {};

  @ApiProperty({ example: '2025-05-02T07:47:26.468Z', description: 'Creation timestamp' })
  createdAt: string = '';

  @ApiProperty({ example: true, description: 'Whether the account is synced with CRM' })
  isSyncedWithCrm: boolean = false;

  @ApiProperty({ example: 'John Doe', description: 'User who created the account' })
  createdBy: string = '';
}

export function ApiFindAllSavedAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all saved accounts' }),
    ApiOkResponse({
        description: 'List of saved accounts with creator information',
        type: SavedAccountDto,
        isArray: true,
      },
    ),
  );
}

export function ApiRemoveSavedAccountDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove saved account' }),
    ApiNoContentResponse({
        description: 'Successful Response',
      },
    ),
  );
}  