import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

export interface HomeMeeting {
  messageScenarioId: string;
  leadName: string;
  leadProfilePictureUrl: string | null;
  position: string | null;
  accountName: string | null;
  accountUrl: string | null;
}

export interface HomeScenarioPerformance {
  account: number;
  lead: number;
  meetings: number;
  responses: number;
  outOfOffice: number;
  bounced: number;
  meetingsEmail: number;
  meetingsLinkedin: number;
  responsesEmail: number;
  responsesLinkedin: number;
}

const EMAIL_ENTRY_TYPES = `('first_email', 'follow_up_email')`;

/** Lead campaign data that belongs to message scenarios created by users of the given company. */
const COMPANY_LEADS_DATA = `
  FROM message_entries_leads_data meld
  JOIN message_entries me ON me.id = meld.message_entry_id
  JOIN message_scenarios ms ON ms.id = me.message_scenario_id
  JOIN users u ON u.id = ms.user_id
  WHERE u.company_id = :companyId
`;

const SINCE = (column: string) => `AND (:since::timestamptz IS NULL OR ${column} >= :since::timestamptz)`;

const percent = (part: number, total: number) => (total > 0 ? ((part / total) * 100).toFixed(1) : '0');

@Injectable()
export class HomeService {
  constructor(private readonly sequelize: Sequelize) {}

  private since(daysInterval?: number): string | null {
    if (!daysInterval) {
      return null;
    }
    return new Date(Date.now() - daysInterval * 24 * 60 * 60 * 1000).toISOString();
  }

  async findMeetings(
    companyId: string,
    { daysInterval, limit = 10, offset = 0 }: { daysInterval?: number; limit?: number; offset?: number },
  ): Promise<HomeMeeting[]> {
    const rows = await this.sequelize.query<{ messageScenarioId: string; leadData: any; accountData: any }>(
      `
      SELECT ms.id AS "messageScenarioId", sl.lead_data AS "leadData", sa.account_data AS "accountData"
      FROM message_entries_leads_data meld
      JOIN message_entries me ON me.id = meld.message_entry_id
      JOIN message_scenarios ms ON ms.id = me.message_scenario_id
      JOIN users u ON u.id = ms.user_id
      JOIN saved_leads sl ON sl.id = meld.lead_id
      LEFT JOIN saved_accounts sa ON sa.id = sl.account_id
      WHERE u.company_id = :companyId
        AND meld.status = 'meeting'
        ${SINCE('meld.updated_at')}
      ORDER BY meld.updated_at DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { companyId, since: this.since(daysInterval), limit, offset },
      },
    );

    return rows.map(({ messageScenarioId, leadData, accountData }) => {
      const position = leadData?.current_positions?.[0];
      return {
        messageScenarioId,
        leadName: leadData?.name ?? `${leadData?.first_name ?? ''} ${leadData?.last_name ?? ''}`.trim(),
        leadProfilePictureUrl: leadData?.profile_picture_url ?? null,
        position: position?.role ?? leadData?.headline ?? null,
        accountName: accountData?.name ?? position?.company ?? null,
        accountUrl: accountData?.profile_url ?? null,
      };
    });
  }

  async findMeetingsResponsesRate(companyId: string, daysInterval?: number) {
    const [row] = await this.sequelize.query<{ total: string; responded: string; contacted: string; meetings: string }>(
      `
      SELECT
        COUNT(sem.id) AS total,
        COUNT(sem.id) FILTER (WHERE sem.status = 'responded') AS responded,
        COUNT(DISTINCT meld.id) AS contacted,
        COUNT(DISTINCT meld.id) FILTER (WHERE meld.status = 'meeting') AS meetings
      FROM sent_email_messages sem
      JOIN message_entries_leads_data meld ON meld.id = sem.message_entry_lead_data_id
      JOIN message_scenarios ms ON ms.id = sem.message_scenario_id
      JOIN users u ON u.id = ms.user_id
      WHERE u.company_id = :companyId
        ${SINCE('sem.sent_at')}
      `,
      { type: QueryTypes.SELECT, replacements: { companyId, since: this.since(daysInterval) } },
    );

    return {
      responseRate: percent(Number(row?.responded ?? 0), Number(row?.total ?? 0)),
      meetingRate: percent(Number(row?.meetings ?? 0), Number(row?.contacted ?? 0)),
    };
  }

  async findScenarioPerformance(companyId: string, daysInterval?: number): Promise<HomeScenarioPerformance> {
    const since = this.since(daysInterval);

    const [counts] = await this.sequelize.query<Record<string, string>>(
      `
      SELECT
        (SELECT COUNT(*) FROM saved_accounts WHERE company_id = :companyId ${SINCE('created_at')}) AS account,
        (SELECT COUNT(*) FROM saved_leads WHERE company_id = :companyId ${SINCE('created_at')}) AS lead
      `,
      { type: QueryTypes.SELECT, replacements: { companyId, since } },
    );

    const [statuses] = await this.sequelize.query<Record<string, string>>(
      `
      SELECT
        COUNT(*) FILTER (WHERE meld.status = 'meeting') AS meetings,
        COUNT(*) FILTER (WHERE meld.status IN ('response', 'meeting')) AS responses,
        COUNT(*) FILTER (WHERE meld.status = 'bounced') AS bounced,
        COUNT(*) FILTER (WHERE meld.status = 'meeting' AND me.type IN ${EMAIL_ENTRY_TYPES}) AS "meetingsEmail",
        COUNT(*) FILTER (WHERE meld.status = 'meeting' AND me.type NOT IN ${EMAIL_ENTRY_TYPES}) AS "meetingsLinkedin",
        COUNT(*) FILTER (WHERE meld.status IN ('response', 'meeting') AND me.type IN ${EMAIL_ENTRY_TYPES}) AS "responsesEmail",
        COUNT(*) FILTER (WHERE meld.status IN ('response', 'meeting') AND me.type NOT IN ${EMAIL_ENTRY_TYPES}) AS "responsesLinkedin"
      ${COMPANY_LEADS_DATA}
        ${SINCE('meld.updated_at')}
      `,
      { type: QueryTypes.SELECT, replacements: { companyId, since } },
    );

    const [outOfOffice] = await this.sequelize.query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM sent_email_messages sem
      JOIN message_scenarios ms ON ms.id = sem.message_scenario_id
      JOIN users u ON u.id = ms.user_id
      WHERE u.company_id = :companyId AND sem.status = 'out_of_office'
        ${SINCE('sem.sent_at')}
      `,
      { type: QueryTypes.SELECT, replacements: { companyId, since } },
    );

    const n = (value?: string) => Number(value ?? 0);
    return {
      account: n(counts?.account),
      lead: n(counts?.lead),
      meetings: n(statuses?.meetings),
      responses: n(statuses?.responses),
      outOfOffice: n(outOfOffice?.count),
      bounced: n(statuses?.bounced),
      meetingsEmail: n(statuses?.meetingsEmail),
      meetingsLinkedin: n(statuses?.meetingsLinkedin),
      responsesEmail: n(statuses?.responsesEmail),
      responsesLinkedin: n(statuses?.responsesLinkedin),
    };
  }
}
