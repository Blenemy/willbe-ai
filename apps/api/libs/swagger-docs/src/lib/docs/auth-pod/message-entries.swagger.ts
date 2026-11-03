import { ApiProperty, ApiResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MessageEntry, MessageStructure } from '@willbe-server/db-core';

export class FollowUpEntryRes {
  @ApiProperty({
    type: MessageStructure,
  })
  messageStructure!: MessageStructure;

  @ApiProperty({
    type: MessageStructure,
    isArray: true,
  })
  messageStructures!: MessageStructure[];
}

export function ApiCreateMessageEntryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create message entry',
    }),
    ApiResponse({
      status: 201,
      description: 'Message entry created successfully',
      type: MessageEntry,
    }),
    ApiResponse({
      status: 400,
      description: 'Unable to create message entry',
    }),
    ApiResponse({
      status: 404,
      description: 'Message scenario not found',
    }),
  );
}
export function ApiFindMessageEntryByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find message entry by ID' }),
    ApiExtraModels(MessageEntry, FollowUpEntryRes),
    ApiResponse({
      status: 200,
      description: 'Message entry found successfully (MessageEntry or FollowUpEntryRes)',
      schema: {
        oneOf: [
          { $ref: getSchemaPath(MessageEntry) },
          { $ref: getSchemaPath(FollowUpEntryRes) },
        ],
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Message entry not found',
    }),
  );
}

export function ApiFindMessageEntriesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find message entries' }),
    ApiResponse({
      status: 200,
      description: 'Message entries found successfully',
      type: MessageEntry,
      isArray: true,
    }),
  );
}

export function ApiUpdateMessageEntryDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update message entry' }),
    ApiResponse({
      status: 200,
      description: 'Message entry updated successfully',
      type: MessageEntry,
    }),
    ApiResponse({
      status: 404,
      description: 'Message entry not found',
    }),
  );
}

export function ApiRemoveMessageEntryDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove message entry' }),
    ApiResponse({
      status: 204,
      description: 'Message entry removed successfully',
    }),
  );
}

export function ApiUpdateMessageEntryLeadDataDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update message entry lead data' }),
    ApiResponse({
      status: 200,
      description: 'Message entry lead data updated successfully',
      type: MessageEntry,
    }),
    ApiResponse({
      status: 404,
      description: 'Message entry lead data not found',
    }),
  );
}

export function ApiGetMessageEntryCsvDocs() {
  return applyDecorators(
    ApiOperation({summary: 'Get message entry CSV' }),
    ApiResponse({
      status: 200,
      description: 'CSV data returned successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Message entry not found',
    }),
  );
}

export function ApiSerchEmailDocs() {
  return applyDecorators(
    ApiOperation({summary: 'Search lead email' }),
    ApiResponse({
      status: 200,
      description: 'Search process started',
    }),
  );
}

export function ApiSerchPhoneDocs() {
  return applyDecorators(
    ApiOperation({summary: 'Search lead phone' }),
    ApiResponse({
      status: 200,
      description: 'Search process started',
    }),
  );
}

export function ApiSendMessagesDocs() {
  return applyDecorators(
    ApiOperation({summary: 'Send messages' }),
    ApiResponse({
      status: 200,
      description: 'Messaegs sent',
    }),
  );
}

export function ApiGenerateMessagesDocs() {
  return applyDecorators(
    ApiOperation({summary: 'Generate messages' }),
    ApiResponse({
      status: 200,
      description: 'Messaegs sent',
    }),
  );
}

export function ApiPullMessageEntryUpdatesDocs() {
  return applyDecorators(
    ApiOperation({summary: 'Pull message entry updates in long polling format (use after search email and search phone requests)' }),
    ApiResponse({
      status: 200,
      description: 'Message entry',
      type: MessageEntry,
    }),
    ApiResponse({
      status: 204,
      description: 'Timeout (30 seconds)',
    }),
  );
}

export function ApiUpdateFollowUpEntryDocs() {
  return applyDecorators(
    ApiOperation({summary: 'Update follow up entry' }),
    ApiResponse({
      status: 200,
      description: 'Follow up entry updated successfully',
      type: MessageEntry,
    }),
    
  );
}