import { ForbiddenException, Injectable } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { Action } from '../enum/action.enum';
import { Company, CompanyProduct, User } from '@willbe-server/db-core';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class AbilityService {
  constructor(private readonly abilityFactory: AbilityFactory) {}

  checkUpdateCompanyAbility(user: User, company: Company): void | never {
    const ability = this.abilityFactory.defineAbility(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, company);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  checkManageCompanyProductsAbility(
    user: User,
    companyProduct: CompanyProduct,
  ): void | never {
    const ability = this.abilityFactory.defineAbility(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.MANAGE, companyProduct);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  checkManageCompanyUsersAbility(
    user: User,
    userToUpdate: User,
  ): void | never {
    const ability = this.abilityFactory.defineAbility(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.MANAGE, userToUpdate);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  checkUpdateUserAbility(
    user: User,
    userToUpdateId: string,
  ): void | never {
    const ability = this.abilityFactory.defineAbility(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, userToUpdateId);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
