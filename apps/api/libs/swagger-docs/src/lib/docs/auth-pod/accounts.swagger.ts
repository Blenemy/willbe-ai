import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiProperty,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';


export class AccountRes {
  @ApiProperty({
    description: 'The ID of the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The title of the account',
    example: 'Willbe',
  })
  companyTitle!: string;

  @ApiProperty({
    description: 'The founded year of the account',
    example: '2020',
  })
  foundedIn!: string;

  @ApiProperty({
    description: 'The headquarters of the account',
    example: 'San Francisco',
  })
  headquarters!: string;

  @ApiProperty({
    description: 'The employees of the account',
    example: '100',
  })
  employees!: string;

  @ApiProperty({
    description: 'The industry of the account',
    example: 'Software',
  })
  industry!: string;

  @ApiProperty({
    description: 'The website of the account',
    example: 'https://willbe.ai',
  })
  website!: string;

  @ApiProperty({
    description: 'The linkedin of the account',
    example: 'https://linkedin.com/company/willbe',
  })
  linkedin!: string;

  @ApiProperty({
    description: 'The description of the account',
    example: 'Willbe is a software company',
  })
  description!: string;

  @ApiProperty({
    description: 'The logo of the account',
    example: 'https://willbe.ai/logo.png',
  })
  logo!: string;

  @ApiProperty({
    description: 'Whether the account is synced with Hubspot',
    example: true,
  })
  isConnectedToHubspot!: boolean;
}

export class AccountLeadRes {
  @ApiProperty({
    description: 'The ID of the lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The first name of the lead',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'The last name of the lead',
    example: 'Doe',
  })
  lastName!: string;

  @ApiProperty({
    description: 'The email of the lead',
    example: 'john.doe@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'The phone of the lead',
    example: '+1234567890',
  })
  phone!: string;

  @ApiProperty({
    description: 'The role of the lead',
    example: 'Software Engineer',
  })
  role!: string;
}

export function ApiFindAccountByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find account by ID' }),
    ApiOkResponse({
        type: AccountRes,
      },
    ),
    ApiNotFoundResponse({
      description: 'Account not found',
    }),
  );
}

export function ApiUpdateAccountDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update account' }),
    ApiOkResponse({ type: AccountRes }),
    ApiNotFoundResponse({
      description: 'Account not found',
    }),
  );
}

export function ApiFindAccountLeadsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find account leads' }),
    ApiOkResponse({
      type: AccountLeadRes,
      isArray: true,
    }),
    ApiNotFoundResponse({
      description: 'Account not found',
    }),
  );
}

export function ApiCreateAccountDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create account' }),
    ApiCreatedResponse({ type: AccountRes }),
    ApiBadRequestResponse({
      description: 'Unable to create account',
    }),
  );
}

export function ApiRemoveAccountsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove accounts' }),
    ApiNoContentResponse({ description: 'Accounts removed successfully' }),
  );
} 
