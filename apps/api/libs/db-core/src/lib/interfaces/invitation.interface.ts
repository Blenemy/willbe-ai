import { CompanyUserRole, UserRole } from './user.interface';

export interface IInvitation {
  id: string;
  email: string;
  role: CompanyUserRole;
  position: string;
  isAccepted: boolean;
  companyId: string;
}
