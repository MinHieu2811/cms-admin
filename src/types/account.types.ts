export type UserRole = 'ADMIN' | 'USER';

export type User = {
  id: string;
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
