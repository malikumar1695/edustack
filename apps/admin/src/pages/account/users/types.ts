
export type Role = {
  id: string;
  name: string;
};

export type UserListItem = {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
  roles: Role[];
};
