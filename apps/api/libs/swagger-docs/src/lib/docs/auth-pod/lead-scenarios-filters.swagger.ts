import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LeadScenarioFilterModel } from '@willbe-server/db-core';

export function ApiCreateLeadScenarioFilterDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create lead scenario filter' }),
    ApiCreatedResponse({
        description: 'Successful Response',
        type: LeadScenarioFilterModel,
      },
    ),
    ApiBadRequestResponse({
      description: 'Unable to create lead scenario filter',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to create lead scenario filter',
            },
          },
        },
      },
    ),
  );
}

export function ApiFindAllLeadScenarioFiltersDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all lead scenario filters' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: LeadScenarioFilterModel,
        isArray: true,
      },
    ),
  );
}

export function ApiFindLeadScenarioFilterByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find lead scenario filter by ID' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: LeadScenarioFilterModel,
      },
    ),
    ApiNotFoundResponse({
      description: 'Lead scenario filter not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Lead scenario filter not found',
            },
          },
        },
      },
    ),
  );
}

export function ApiUpdateLeadScenarioFilterDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update lead scenario filter' }),
    ApiOkResponse({
        description: 'Successful Response',
        type: LeadScenarioFilterModel,
      },
    ),
    ApiBadRequestResponse({
      description: 'Unable to update lead scenario filter',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to update lead scenario filter',
            },
          },
        },
      },
    ),
  );
}

export function ApiRemoveLeadScenarioFilterDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove lead scenario filter' }),
    ApiNoContentResponse({
        description: 'Successful Response',
      },
    ),
  );
}
