export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER';

export type User = {
  id: number;
  name: string;
  email: string;
  activated: boolean;
  hashedPassword: string;
  langKey: string;
  authorities: UserRole[];
  login?: string;
  emailVerified?: Date;
  createdBy?: string;
  createdAt?: Date | string;
  lastModifiedBy?: string;
  updatedAt?: Date | string;
};

export type UserList = {
  content: User[];
  totalItems: number;
};

export type AccountError = {
  title: string;
  errorKey: 'userexists' | 'emailexists';
};

export type Account = User;
