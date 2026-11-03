import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiSearchLinkedinParamsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Search LinkedIn parameters' }),
    ApiOkResponse({
      description: 'Successful Response',
      isArray: true,
      example: [
        {
            'object': 'LinkedinSearchParameter',
            'title': 'Manager',
            'id': '2'
        },
        {
            'object': 'LinkedinSearchParameter',
            'title': 'Project Manager',
            'id': '4'
        },
        {
            'object': 'LinkedinSearchParameter',
            'title': 'Team Manager',
            'id': '2'
        },
      ],
    }),
    ApiBadRequestResponse({
      description: 'Unable to retrieve parameters',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unable to retrieve parameters',
          },
        },
      },
    }),
  );
}

export function ApiGetLanguagesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get languages' }),
    ApiOkResponse({
      description: 'Successful Response',
      isArray: true,
      example: [
        'Afar',
        'Abkhaz',
        'Avestan',
        'Afrikaans',
        'Akan',
        'Amharic',
        'Aragonese',
        'Arabic',
        'Assamese',
        'Avaric',
        'Aymara',
        'Azerbaijani',
      ]
    }),
  );
}

export function ApiGetLeadScenarioDropdownsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get languages' }),
    ApiOkResponse({
      description: 'Successful Response',
      example: {
        'tenuresAtJobTitle': {
            'from': [
                '0',
                '1',
                '3',
                '6',
                '10'
            ],
            'to': [
                '1',
                '2',
                '5',
                '10'
            ]
        },
        'seniorities': [
            'Experienced manager',
            'Entry level manager',
            'Strategic',
            'Senior',
            'Entry level',
            'In training'
        ],
        'totalYearsOfExpirience': {
            'from': [
                '0',
                '1',
                '3',
                '6',
                '10'
            ],
            'to': [
                '1',
                '2',
                '5',
                '10'
            ]
        },
        'networkDistances': [
            {
                'title': '1st',
                'value': '2'
            },
            {
                'title': '2nd',
                'value': '1'
            },
            {
                'title': '3rd',
                'value': '3'
            }
        ],
        'companyHeadcounts': {
            'from': [
                '1',
                '11',
                '51',
                '201',
                '501',
                '1001',
                '5001',
                '10001'
            ],
            'to': [
                '10',
                '50',
                '200',
                '5000',
                '1000',
                '5000',
                '10000'
            ]
        },
        'companyTypes': [
            'Public company',
            'Privately held',
            'Non profit',
            'Educational institution',
            'Partnership',
            'Self employed',
            'Self owned',
            'Government agency'
        ],
        'tenuresAtCompany': {
            'from': [
                '0',
                '1',
                '3',
                '6',
                '10'
            ],
            'to': [
                '1',
                '2',
                '5',
                '10'
            ],
        },
      },
    }),
  );
}

export function ApiGetAccountScenarioDropdownsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get languages' }),
    ApiOkResponse({
      description: 'Successful Response',
      example: {
          'headcounts': {
              'from': [
                  '1',
                  '11',
                  '51',
                  '201',
                  '501',
                  '1001',
                  '5001',
                  '10001'
              ],
              'to': [
                  '10',
                  '50',
                  '200',
                  '5000',
                  '1000',
                  '5000',
                  '10000'
              ]
          },
          'fortunes': {
              'from': [
                  '0',
                  '51',
                  '101',
                  '251'
              ],
              'to': [
                  '50',
                  '100',
                  '250',
                  '500'
              ]
          },
          'followersCounts': {
              'from': [
                  '0',
                  '51',
                  '101',
                  '1001',
                  '5001'
              ],
              'to': [
                  '50',
                  '100',
                  '1000',
                  '5000'
              ]
          },
          'recentActivities': [
              {
                  'title': 'Senior Leadership Changes',
                  'value': 'senior_leadership_changes'
              },
              {
                  'title': 'Funding Events',
                  'value': 'funding_events'
              }
          ],
          'networkDistances': [
              {
                  'title': '1st',
                  'value': '2'
              },
              {
                  'title': '2nd',
                  'value': '1'
              },
              {
                  'title': '3rd',
                  'value': '3'
              }
          ],
          'annualRevenues': {
              'from': [
                  '0.2',
                  '1',
                  '2.5',
                  '5',
                  '10',
                  '20',
                  '50',
                  '100',
                  '500',
                  '1000',
                  '+1000'
              ],
              'to': [
                  '1',
                  '2.5',
                  '5',
                  '10',
                  '20',
                  '50',
                  '100',
                  '500',
                  '1000',
                  '+1000'
              ],
              'currencies': [
                  'AED',
                  'AFN',
                  'ALL',
                  'AMD',
                  'ANG',
                  'AOA',
                  'ARS',
                  'AUD',
                  'AWG',
                  'AZN',
              ],
          },
      },
    }),
  );
}
