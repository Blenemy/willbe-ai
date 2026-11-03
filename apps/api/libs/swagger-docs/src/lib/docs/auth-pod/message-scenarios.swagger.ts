import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { MessageScenario, SentEmailMessage, ReceivedMessage, MessageEntryType, SavedLead, FindLeadsRes } from '@willbe-server/db-core';

export class ScenarioStatistics {
  @ApiProperty()
  totalSent!: number;

  @ApiProperty()
  bounced!: number;

  @ApiProperty()
  replied!: number;

  @ApiProperty()
  bounceRate!: number;

  @ApiProperty()
  responseRate!: number;

  @ApiProperty()
  meetingRate!: number;

  @ApiProperty()
  outOfOfficeRate!: number;
}

class ScenarioSentMessageDto extends SentEmailMessage {
  @ApiProperty({ description: 'Message content from the related MessageEntryLeadData', nullable: true })
  message?: string | null;
}

class ScenarioReceivedMessageDto extends ReceivedMessage {}

class GetScenarioMessagesResponseDto {
  @ApiProperty({ description: 'Lead ID from the source system', example: 'urn:li:member:12345678' })
  id!: string;

  @ApiProperty({ description: 'Lead First Name' })
  first_name!: string;

  @ApiProperty({ description: 'Lead Last Name' })
  last_name!: string;

  @ApiProperty({ description: 'Lead Headline/Position' })
  headline!: string;

  @ApiProperty({ description: 'Lead Location' })
  location!: string;

  @ApiProperty({ description: 'Lead Public Profile URL' })
  public_profile_url!: string;

  @ApiProperty({ description: 'Lead Public Identifier' })
  public_identifier!: string;

  @ApiProperty({ type: [ScenarioSentMessageDto] })
  sentMessages!: ScenarioSentMessageDto[];

  @ApiProperty({ type: [ScenarioReceivedMessageDto] })
  receivedMessages!: ScenarioReceivedMessageDto[];
}

class CadenceTimeframeEntryDto {
  @ApiProperty({ description: 'ID of the message entry' })
  id!: string;

  @ApiProperty({ enum: MessageEntryType, description: 'Type of the cadence step' })
  cadenceType!: MessageEntryType;

  @ApiProperty({ description: 'Name of the message structure used', nullable: true })
  structure!: string | null;

  @ApiProperty({ description: 'Number of mails sent for this entry' })
  mailsSent!: number;

  @ApiProperty({ description: 'Meeting rate for this entry (%)' })
  meetingRate!: number;

  @ApiProperty({ description: 'Response rate for this entry (%)' })
  responseRate!: number;

  @ApiProperty({ description: 'Out of office rate for this entry (%)' })
  outOfOfficeRate!: number;

  @ApiProperty({ description: 'Bounce rate for this entry (%)' })
  bounceRate!: number;

  @ApiProperty({ description: 'Scheduled date for this entry' })
  dateToBeSent!: Date;

  @ApiProperty({ description: 'Whether messages have been sent for this entry' })
  isSent!: boolean;
}

class LeadInCadenceDto extends SavedLead {
  @ApiProperty({ description: 'Current status within the cadence', example: 'in_cadence' })
  status!: string;
}

export function ApiCreateMessageScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create message scenario' }),
    ApiResponse({
      status: 201,
      description: 'Message scenario created successfully',
      type: MessageScenario,
    }),
  );
}

export function ApiCreateMessageScenarioWithLeadsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create message scenario with leads' }),
    ApiResponse({
      status: 201,
      description: 'Message scenario created successfully',
      type: MessageScenario,
    }),
    ApiResponse({
      status: 404,
      description: 'Lead scenario not found',
    }),
  );
}
export function ApiUpdateMessageScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update message scenario' }),
    ApiResponse({
      status: 200,
      description: 'Message scenario updated successfully',
      type: MessageScenario,
    }),
  );
}

export function ApiAddLeadsToMessageScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Add leads with given IDs to message scenario' }),
    ApiResponse({
      status: 200,
      description: 'Leads successfully added to message scenario',
      type: MessageScenario,
    }),
    ApiResponse({
      status: 404,
      description: 'Message scenario not found',
    }),
  );
}

export function ApiFindMessageScenarioByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find message scenario by ID' }),
    ApiResponse({
      status: 200,
      description: 'Message scenario retrieved successfully',
      type: MessageScenario,
    }),
    ApiResponse({
      status: 404,
      description: 'Message scenario not found',
    }),
  );
}

export function ApiFindMessageScenariosDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find message scenarios' }),
    ApiResponse({
      status: 200,
      description: 'Message scenario retrieved successfully',
      type: MessageScenario,
      isArray: true,
      example: [
        {
          id: '1e4567e8-9b12-d3a4-5642-661417400001',
          name: 'Scenario 1',
          status: 'not_started',
          userId: '2e4567e8-9b12-d3a4-5642-661417400002',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { firstName: 'John', lastName: 'Doe' },
          leadsInCadence: 2,
          messagesSent: 5,
        },
        {
          id: '3e4567e8-9b12-d3a4-5642-661417400003',
          name: 'Scenario 2',
          status: 'in_progress',
          userId: '4e4567e8-9b12-d3a4-5642-661417400004',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { firstName: 'Alice', lastName: 'Smith' },
          leadsInCadence: 4,
          messagesSent: 12,
        },
        {
          id: '5e4567e8-9b12-d3a4-5642-661417400005',
          name: 'Scenario 3',
          status: 'completed',
          userId: '6e4567e8-9b12-d3a4-5642-661417400006',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { firstName: 'Bob', lastName: 'Johnson' },
          leadsInCadence: 1,
          messagesSent: 20,
        },
      ],
    }),
  );
}

export function ApiRemoveLeadsFromMessageScenarioDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove leads from message scenario' }),
    ApiResponse({
      status: 200,
      description: 'Leads successfully removed from message scenario',
      type: MessageScenario,
    }),
    ApiResponse({
      status: 404,
      description: 'Message scenario not found',
    }),
  );
}

export function ApiRemoveMessageScenariosDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove message scenarios' }),
    ApiResponse({
      status: 204,
      description: 'Message scenarios successfully removed',
    }),
  );
}

export function ApiGetScenarioStatisticsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get scenario statistics' }),
    ApiResponse({
      status: 200,
      description: 'Scenario statistics retrieved successfully',
      type: ScenarioStatistics,
    }),
  );
}

export function ApiGetScenarioMessagesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get scenario messages grouped by lead' }),
    ApiResponse({
      status: 200,
      description: 'Scenario messages retrieved successfully',
      type: GetScenarioMessagesResponseDto,
      isArray: true,
    }),
    ApiResponse({ status: 404, description: 'Scenario not found' }),
  );
}

export function ApiGetCadenceTimeframeDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get cadence timeframe steps and stats' }),
    ApiResponse({
      status: 200,
      description: 'Cadence timeframe retrieved successfully',
      type: CadenceTimeframeEntryDto,
      isArray: true,
    }),
    ApiResponse({ status: 404, description: 'Scenario not found' }),
  );
}

export function ApiGetLeadsInCadenceDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get leads currently active in the cadence' }),
    ApiResponse({
      status: 200,
      description: 'Leads in cadence retrieved successfully',
      type: LeadInCadenceDto,
      isArray: true,
    }),
    ApiResponse({ status: 404, description: 'Scenario not found' }),
  );
}

export function ApiGetCsvDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get scenario leads data as CSV' }),
    ApiResponse({
      status: 200,
      description: 'CSV data retrieved successfully',
      content: { 'text/csv': {} }
    }),
    ApiResponse({ status: 404, description: 'Scenario not found' }),
  );
}
