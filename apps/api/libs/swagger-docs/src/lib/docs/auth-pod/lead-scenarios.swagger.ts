import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from '@nestjs/swagger';
import { FindLeadsRes, LeadScenarioModel, SavedLead } from '@willbe-server/db-core';

export class SaveLeadsReq {
  @ApiProperty({
    type: FindLeadsRes,
    isArray: true,
  })
  declare leads: FindLeadsRes[];
}

export function ApiCreateLeadScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create lead scenario' }),
    ApiCreatedResponse({
        description: 'Successful Response',
        type: LeadScenarioModel,
      },
    ),
    ApiBadRequestResponse({
      description: 'Unable to create lead scenario',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to create lead scenario',
            },
          },
        },
      },
    ),
  );
}

export function ApiFindAllLeadScenariosDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all lead scenarios' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: LeadScenarioModel,
        isArray: true,
      },
    ),
  );
}

export function ApiFindLeadScenarioByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find lead scenario by ID' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: LeadScenarioModel,
      },
    ),
    ApiNotFoundResponse({
      description: 'Lead scenario not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Lead scenario not found',
            },
          },
        },
      },
    ),
  );
}

export function ApiUpdateLeadScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update lead scenario' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: LeadScenarioModel,
      },
    ),
    ApiNotFoundResponse({
      description: 'Lead scenario not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Lead scenario not found',
            },
          },
        },
      },
    ),
  );
}

export function ApiRemoveLeadScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove lead scenario' }),
    ApiNoContentResponse({
        description: 'Successful Response',
      },
    ),
  );
}

export function ApiFindLeadsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find leads' }),
    ApiOkResponse({
        description: 'List of leads',
        type: FindLeadsRes,
        isArray: true,
      },
    ),
    ApiBadRequestResponse({
      description: 'Unable to find leads',
    },
  ),
  );
}

export function ApiSaveLeadsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Save leads' }),
    ApiBody({ type: SaveLeadsReq  }),
    ApiCreatedResponse({
        description: 'List of saved leads',
        type: SavedLead,
      },
    ),
    ApiNotFoundResponse({
      description: 'Lead scenario not found',
      },
    ),
    ApiBadRequestResponse({
      description: 'Unable to save leads',
      },
    ),
  );
} 

export function ApiFindSavedLeadsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find saved leads' }),
    ApiOkResponse({
        description: 'List of saved leads',
        type: SavedLead,
        isArray: true,
      },
    ),
  );
}

export function ApiRemoveSavedLeadDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove saved lead' }),
    ApiNoContentResponse({
        description: 'Successful Response',
      },
    )
  );
}

export function ApiGenerateLeadScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate lead scenario from account scenario or specific accounts' }),
    ApiCreatedResponse({
        description: 'Successful Response',
        type: LeadScenarioModel,
      },
    ),
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

export function ApiFindLeadsByAccountsAndScenariosDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find leads by given saved account IDs and lead scenarios IDs' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: SavedLead,
        isArray: true,
      },
    ),
  );
}  
