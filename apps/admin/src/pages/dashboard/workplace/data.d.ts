export type TagType = {
  key: string;
  label: string;
};

export type GeographicType = {
  province: {
    label: string;
    key: string;
  };
  city: {
    label: string;
    key: string;
  };
};

export type NoticeType = {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: string;
  member: string;
  href: string;
  memberLink: string;
};

export type CurrentUser = {
  name: string;
  avatar: string;
  userid: string;
  notice: NoticeType[];
  email: string;
  signature: string;
  title: string;
  group: string;
  tags: TagType[];
  notifyCount: number;
  unreadCount: number;
  country: string;
  geographic: GeographicType;
  address: string;
  phone: string;
};

export type ActivitiesType = {
  id: string;
  updatedAt: string;
  user: {
    link?: string;
    name: string;
    avatar: string;
  };
  group?: {
    name: string;
    link: string;
  };
  project?: {
    name: string;
    link: string;
  };
  comment?: {
    name: string;
    link: string;
  };
  template: string;
};

export type RadarData = {
  name: string;
  label: string;
  value: number;
};
