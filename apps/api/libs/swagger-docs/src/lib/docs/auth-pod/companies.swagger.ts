import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Company, CompanyProduct } from '@willbe-server/db-core';

export function ApiUpdateCompanyDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update company data' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: Company
      },
    ),
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

export function ApiFindCompanyByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find company by ID' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: Company
      },
    ),
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

export function ApiCreateCompanyProductDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create company product or service' }),
    ApiCreatedResponse({
      description: 'Successful Response',
      type: CompanyProduct
      },
    ),
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

export function ApiFindAllCompanyProductsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all company products and services' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: Company,
      isArray: true,
      },
    ),
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

export function ApiFindCompanyProductByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find by ID company product or service' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: CompanyProduct
      },
    ),
    ApiNotFoundResponse({
      description: 'Company product or service not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Company product or service not found',
          },
        },
      },
    }),
  );
}

export function ApiUpdateCompanyProductsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update company product or service' }),
    ApiOkResponse({
      description: 'Successful Response',
      type: CompanyProduct
      },
    ),
    ApiNotFoundResponse({
      description: 'Company product or service not found',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Company product or service not found',
          },
        },
      },
    }),
  );
}

export function ApiRemoveCompanyProductsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove company product or service' }),
    ApiNoContentResponse({
      description: 'Product or service successfully removed',
      },
    ),
  );
}
