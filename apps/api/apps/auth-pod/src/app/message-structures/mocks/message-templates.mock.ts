import { MessageLanguage } from '@willbe-server/db-core';

export const messageTemplateMock = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    objective: `Establish a strategic partnership to expand market reach and create mutual value`,
    subject: `Partnership Opportunity - Let's Create Something Amazing Together`,
    greeting: `Dear Mr. Anderson`,
    introduction: {
        wordsLimit: 50,
        text: `I hope this email finds you well. I recently came across your company's innovative work 
        in the tech industry and was thoroughly impressed by your achievements.`,
    },
    paragraphs: [
        {
            wordsLimit: 100,
            text: `I am reaching out because I believe there's a unique opportunity for our companies to collaborate 
            and create something extraordinary together. Our expertise in AI solutions, combined with your market 
            leadership in cloud services, could revolutionize how businesses approach digital transformation.`,
        },
        {
            wordsLimit: 80,
            text: `Would you be interested in scheduling a brief call next week to explore potential synergies? 
            I'd be happy to share some specific ideas I have in mind.`,
        },
    ],
    goodbye: {
        wordsLimit: 30,
        text: `Looking forward to your response.`,
    },
    sampleMessage: `Dear Mr. Anderson,
      I hope this email finds you well. I recently came across your company's innovative work in the tech industry and was thoroughly impressed by your achievements.
      I am reaching out because I believe there's a unique opportunity for our companies to collaborate and create something extraordinary together. Our expertise in AI solutions, combined with your market leadership in cloud services, could revolutionize how businesses approach digital transformation.
      Would you be interested in scheduling a brief call next week to explore potential synergies? I'd be happy to share some specific ideas I have in mind.
      Looking forward to your response.`,
    language: MessageLanguage.EN,
    messageStructureId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
};

export const emptyMessageTemplateMock = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    objective: null,
    subject: null,
    greeting: null,
    introduction: null,
    paragraphs: [],
    goodbye: null,
    sampleMessage: null,
    language: MessageLanguage.EN,
};


