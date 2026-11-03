import { Injectable } from '@nestjs/common';
import { Company, CompanyProduct, Invitation, User, UserRole } from '@willbe-server/db-core';
import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Action } from '../enum/action.enum';

export type Subjects =
  InferSubjects<
    typeof User |
    typeof Company |
    typeof CompanyProduct |
    typeof Invitation
  > | 'all';


@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      can(Action.UPDATE, Company, { id: { $eq: user.companyId } });
      can(Action.READ, Company);;

      can(Action.CREATE, Invitation);

      can(Action.MANAGE, CompanyProduct);
      
      can(Action.MANAGE, User, { companyId: { $eq: user.companyId } })
      
      can(Action.UPDATE, User);
    }

    if (user.role === UserRole.MEMBER) {
      can(Action.READ, Company);
      can(Action.READ, CompanyProduct);

      can(Action.UPDATE, User);
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
