import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { LeadScenarioFilterKey } from '@willbe-server/db-core';
import ISO6391 from 'iso-639-1';

interface ValidationError {
  isValid: boolean;
  message?: string;
}

function isValidSearchParam(value: any): ValidationError {
  if (typeof value !== 'object' || value === null) {
    return { isValid: false, message: 'Must be an object' };
  }
  if (!('id' in value)) {
    return { isValid: false, message: 'Missing id field' };
  }
  if (!('title' in value)) {
    return { isValid: false, message: 'Missing title field' };
  }
  if (typeof value.id !== 'string') {
    return { isValid: false, message: 'Id must be a string' };
  }
  if (typeof value.title !== 'string') {
    return { isValid: false, message: 'Title must be a string' };
  }
  return { isValid: true };
}

function isValidIncludeExclude(value: any, allowSearchParams = false): ValidationError {
  if (typeof value !== 'object' || value === null) {
    return { isValid: false, message: 'Must be an object' };
  }
  if (!('include' in value)) {
    return { isValid: false, message: 'Missing include field' };
  }
  if (!('exclude' in value)) {
    return { isValid: false, message: 'Missing exclude field' };
  }
  if (!Array.isArray(value.include)) {
    return { isValid: false, message: 'Include must be an array' };
  }
  if (!Array.isArray(value.exclude)) {
    return { isValid: false, message: 'Exclude must be an array' };
  }

  if (allowSearchParams) {
    for (const item of value.include) {
      const validation = isValidSearchParam(item);
      if (!validation.isValid) {
        return { isValid: false, message: `Invalid include item: ${validation.message}` };
      }
    }
    for (const item of value.exclude) {
      const validation = isValidSearchParam(item);
      if (!validation.isValid) {
        return { isValid: false, message: `Invalid exclude item: ${validation.message}` };
      }
    }
  } else {
    if (!value.include.every((v: any) => typeof v === 'string')) {
      return { isValid: false, message: 'Include items must be strings' };
    }
    if (!value.exclude.every((v: any) => typeof v === 'string')) {
      return { isValid: false, message: 'Exclude items must be strings' };
    }
  }

  return { isValid: true };
}

function isValidRange(value: any): ValidationError {
  if (typeof value !== 'object' || value === null) {
    return { isValid: false, message: 'Must be an object' };
  }
  if (!('from' in value)) {
    return { isValid: false, message: 'Missing from field' };
  }
  if (!('to' in value)) {
    return { isValid: false, message: 'Missing to field' };
  }

  const from = Number(value.from);
  const to = Number(value.to);

  if (isNaN(from)) {
    return { isValid: false, message: 'From value must be a number' };
  }
  if (isNaN(to)) {
    return { isValid: false, message: 'To value must be a number' };
  }
  if (from > to) {
    return { isValid: false, message: 'From value must be less than or equal to to value' };
  }

  return { isValid: true };
}

function validateFilterValue(item: any): ValidationError {
  if (!item.filterKey) {
    return { isValid: false, message: 'Missing filterKey' };
  }
  if (!item.filterValue) {
    return { isValid: false, message: 'Missing filterValue' };
  }

  switch (item.filterKey) {
    case LeadScenarioFilterKey.FIRST_NAME:
    case LeadScenarioFilterKey.LAST_NAME:
    case LeadScenarioFilterKey.KEYWORDS: {
      if (typeof item.filterValue !== 'string') {
        return { isValid: false, message: `${item.filterKey} must be a string` };
      }
      break;
    }

    case LeadScenarioFilterKey.COMPANY_TYPE: {
      if (!Array.isArray(item.filterValue)) {
        return { isValid: false, message: 'Company type must be an array' };
      }
      if (!item.filterValue.every((type: any) => typeof type === 'string')) {
        return { isValid: false, message: 'Company type items must be strings' };
      }
      break;
    }

    case LeadScenarioFilterKey.LANGUAGE: {
      if (!Array.isArray(item.filterValue)) {
        return { isValid: false, message: 'Language must be an array' };
      }
      for (const lang of item.filterValue) {
        if (typeof lang !== 'string') {
          return { isValid: false, message: 'Language items must be strings' };
        }
        if (!ISO6391.getCode(lang)) {
          return { isValid: false, message: `Invalid language: ${lang}` };
        }
      }
      break;
    }

    case LeadScenarioFilterKey.JOB_TITLE:
    case LeadScenarioFilterKey.PAST_JOB_TITLE:
    case LeadScenarioFilterKey.SCHOOL:
    case LeadScenarioFilterKey.LOCATION:
    case LeadScenarioFilterKey.CURRENT_COMPANY:
    case LeadScenarioFilterKey.PAST_COMPANY:
    case LeadScenarioFilterKey.COMPANY_INDUSTRY:
    case LeadScenarioFilterKey.COMPANY_LOCATION: {
      const includeExcludeValidation = isValidIncludeExclude(item.filterValue, true);
      if (!includeExcludeValidation.isValid) {
        return { isValid: false, message: `${item.filterKey}: ${includeExcludeValidation.message}` };
      }
      break;
    }

    case LeadScenarioFilterKey.SENIORITY: {
      const seniorityValidation = isValidIncludeExclude(item.filterValue, false);
      if (!seniorityValidation.isValid) {
        return { isValid: false, message: `Seniority: ${seniorityValidation.message}` };
      }
      break;
    }

    case LeadScenarioFilterKey.JOB_TENURE:
    case LeadScenarioFilterKey.EXPERIENCE_YEARS:
    case LeadScenarioFilterKey.COMPANY_HEADCOUNT:
    case LeadScenarioFilterKey.COMPANY_TENURE: {
      const rangeValidation = isValidRange(item.filterValue);
      if (!rangeValidation.isValid) {
        return { isValid: false, message: `${item.filterKey}: ${rangeValidation.message}` };
      }
      break;
    }

    case LeadScenarioFilterKey.POSTED_ON_LINKEDIN:
    case LeadScenarioFilterKey.MENTIONED_IN_NEWS:
    case LeadScenarioFilterKey.VIEWED_YOUR_PROFILE:
    case LeadScenarioFilterKey.FOLLOWING_YOUR_COMPANY:
    case LeadScenarioFilterKey.PAST_COLLEAGUE:
    case LeadScenarioFilterKey.SHARED_EXPERIENCES:
    case LeadScenarioFilterKey.CHANGED_JOBS: {
      if (typeof item.filterValue !== 'boolean') {
        return { isValid: false, message: `${item.filterKey} must be a boolean` };
      }
      break;
    }

    case LeadScenarioFilterKey.NETWORK_DISTANCE: {
      const distance = Number(item.filterValue);
      if (isNaN(distance)) {
        return { isValid: false, message: 'Network distance must be a number' };
      }
      if (distance <= 0) {
        return { isValid: false, message: 'Network distance must be greater than 0' };
      }
      break;
    }

    default:
      return { isValid: false, message: `Unknown filter key: ${item.filterKey}` };
  }

  return { isValid: true };
}

export function ValidateFilterFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateFilterFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments): boolean {
          if (!Array.isArray(value)) {
            args.constraints[0] = 'Filter values must be an array';
            return false;
          }

          for (const item of value) {
            const validation = validateFilterValue(item);
            if (!validation.isValid) {
              args.constraints[0] = validation.message;
              return false;
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return args.constraints[0] ?? 'Filter values do not match the required format';
        },
      },
    });
  };
} 
