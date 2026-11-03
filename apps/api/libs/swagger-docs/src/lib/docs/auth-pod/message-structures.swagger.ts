import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageStructure, MessageTemplate } from '@willbe-server/db-core';

export function ApiCreateMessageStructureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create message structure' }),
    ApiResponse({
      status: 201,
      description: 'Message structure created successfully',
      type: MessageStructure,
    }),
  );
}

export function ApiFindAllStructureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all message structures' }),
    ApiResponse({
      status: 200,
      description: 'List of message structures retrieved successfully',
      type: [MessageStructure],
    }),
  );
}

export function ApiFindByIdStructureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find message structure by ID' }),
    ApiResponse({
      status: 200,
      description: 'Message structure retrieved successfully',
      type: MessageStructure,
    }),
    ApiResponse({
      status: 404,
      description: 'Message structure not found',
    }),
  );
}

export function ApiUpdateStructureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update message structure' }),
    ApiResponse({
      status: 200,
      description: 'Message structure updated successfully',
      type: MessageStructure,
    }),
    ApiResponse({
      status: 404,
      description: 'Message structure not found',
    }),
  );
}

export function ApiDeleteStructureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete message structure' }),
    ApiResponse({
      status: 204,
      description: 'Message structure deleted successfully',
    }),
  );
}

export function ApiCreateMessageTemplateDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create message template' }),
    ApiResponse({
      status: 201,
      description: 'Message template created successfully',
      type: MessageTemplate,
    }),
  );
}

export function ApiFindOneMessageTemplateDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find message template' }),
    ApiResponse({
      status: 200,
      description: 'Message template retrieved successfully',
      type: MessageTemplate,
    }),
    ApiResponse({
      status: 404,
      description: 'Message template not found',
    }),
  );
}

export function ApiUpdateMessageTemplateDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update message template' }),
    ApiResponse({
      status: 200,
      description: 'Message template updated successfully',
      type: MessageTemplate,
    }),
  );
}

export function ApiDeleteMessageTemplateDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete message template' }),
    ApiResponse({
      status: 204,
      description: 'Message template deleted successfully',
    }),
  );
}

export function ApiFindExampleMessageTemplateDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a friendly message example template' }),
    ApiResponse({
      status: 200,
      description: 'Message example template section',
      example: {
        language: 'en',
        type: 'introduction',
        value: 'Say something to break the ice in a professional and witty way, avoiding typical sales openings. Add a smiley emoji (🙂) to keep it friendly. The introduction should be personalized but not sales-focused.',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Example template not found',
    }),
  );
}

export function ApiCloneMessageStructureDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Clone message structure' }),
    ApiResponse({
      status: 201,
      description: 'Message structure cloned successfully',
      type: MessageStructure,
    }),
    ApiResponse({
      status: 404,
      description: 'Message structure not found',
    }),
  );
}