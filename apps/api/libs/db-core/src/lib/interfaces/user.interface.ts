export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyId: string;
  position: string;
  role: UserRole;
  language: UserLanguage;
  refreshToken?: string;
  authProvider?: UserAuthProvider;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum CompanyUserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum UserLanguage {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
}

export enum UserScopes {
  WITH_PASSWORD = 'withPassword',
  WITH_REFRESH_TOKEN = 'withRefreshToken',
}

export enum UserAuthProvider {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  MICROSOFT = 'microsoft',
}