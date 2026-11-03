'use strict';

const USER_ID = '9b3e4c7a-5d0f-4e3b-9c4a-0f6d7e8a9b03';

const STRUCTURES = [
  {
    id: 'c1a2b3c4-1111-4a1b-8c1d-000000000001',
    templateId: 'd1a2b3c4-1111-4a1b-8c1d-000000000001',
    name: 'LinkedIn connection request',
    messageType: 'linkedin_connection',
    wordsLimit: 50,
    subjectType: null,
    template: {
      objective: 'Get the connection request accepted by showing a relevant, specific reason to connect.',
      subject: null,
      greeting: 'Hi {first_name},',
      introduction: { text: 'Mention something specific about their role or company.', wordsLimit: 25 },
      paragraphs: [{ text: 'Briefly explain why connecting makes sense for both sides.', wordsLimit: 25 }],
      goodbye: null,
      sampleMessage:
        'Hi Anna, noticed Northwind is growing its SDR team in Berlin. I work on outbound tooling for B2B sales teams and would love to connect.',
    },
  },
  {
    id: 'c1a2b3c4-2222-4a1b-8c1d-000000000002',
    templateId: 'd1a2b3c4-2222-4a1b-8c1d-000000000002',
    name: 'LinkedIn intro message',
    messageType: 'linkedin_message',
    wordsLimit: 120,
    subjectType: null,
    template: {
      objective: 'Start a conversation and offer a short call.',
      subject: null,
      greeting: 'Hi {first_name},',
      introduction: { text: 'Thank them for connecting and reference their company.', wordsLimit: 30 },
      paragraphs: [
        { text: 'Describe the main pain our product solves for companies like theirs.', wordsLimit: 50 },
        { text: 'Ask for a 15 minute call.', wordsLimit: 20 },
      ],
      goodbye: { text: 'Best,', wordsLimit: 5 },
      sampleMessage:
        'Hi Anna, thanks for connecting! Teams like Northwind usually spend hours building lead lists by hand. Willbe builds them and drafts personalised sequences automatically. Open to a 15 minute call next week?',
    },
  },
  {
    id: 'c1a2b3c4-3333-4a1b-8c1d-000000000003',
    templateId: 'd1a2b3c4-3333-4a1b-8c1d-000000000003',
    name: 'Cold email',
    messageType: 'first_email',
    wordsLimit: 150,
    subjectType: 'account_company',
    template: {
      objective: 'Book a discovery call with the lead.',
      subject: 'Outbound at {company}',
      greeting: 'Hi {first_name},',
      introduction: { text: 'Open with an observation about their company or industry.', wordsLimit: 30 },
      paragraphs: [
        { text: 'Explain the value of our product with one concrete outcome.', wordsLimit: 60 },
        { text: 'Soft call to action for a short call.', wordsLimit: 25 },
      ],
      goodbye: { text: 'Best regards,', wordsLimit: 5 },
      sampleMessage:
        'Hi Anna, Northwind has been hiring SDRs across Europe. Willbe helps teams like yours find the right accounts and write multilingual outreach in minutes instead of hours. Would a short call next week make sense?',
    },
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    for (const structure of STRUCTURES) {
      await queryInterface.sequelize.query(
        `INSERT INTO message_structures (id, name, message_type, words_limit, subject_type, user_id, created_at, updated_at)
         VALUES (:id, :name, :messageType, :wordsLimit, :subjectType, :userId, :now, :now)`,
        {
          replacements: {
            id: structure.id,
            name: structure.name,
            messageType: structure.messageType,
            wordsLimit: structure.wordsLimit,
            subjectType: structure.subjectType,
            userId: USER_ID,
            now,
          },
        },
      );

      const { template } = structure;
      await queryInterface.sequelize.query(
        `INSERT INTO message_templates
           (id, objective, subject, greeting, introduction, paragraphs, goodbye, sample_message, language, message_structure_id, created_at, updated_at)
         VALUES
           (:id, :objective, :subject, :greeting, :introduction::jsonb, ARRAY[:paragraphs]::jsonb[], :goodbye::jsonb, :sampleMessage, 'en', :structureId, :now, :now)`,
        {
          replacements: {
            id: structure.templateId,
            objective: template.objective,
            subject: template.subject,
            greeting: template.greeting,
            introduction: JSON.stringify(template.introduction),
            paragraphs: template.paragraphs.map((paragraph) => JSON.stringify(paragraph)),
            goodbye: template.goodbye ? JSON.stringify(template.goodbye) : null,
            sampleMessage: template.sampleMessage,
            structureId: structure.id,
            now,
          },
        },
      );
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('message_structures', { id: STRUCTURES.map((structure) => structure.id) });
  },
};
