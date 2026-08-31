
export type Role = {
  id: string;
  name: string;
};

export type UserListItem = {
  id: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
  roles: Role[];
};
