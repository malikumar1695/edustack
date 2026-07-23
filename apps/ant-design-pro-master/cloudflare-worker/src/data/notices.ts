type NoticeItem =
  | {
      id: string;
      avatar: string;
      title: string;
      datetime: string;
      type: 'notification';
      read?: boolean;
    }
  | {
      id: string;
      avatar: string;
      title: string;
      description: string;
      datetime: string;
      type: 'message';
      clickClose?: boolean;
    }
  | {
      id: string;
      title: string;
      description: string;
      extra: string;
      status: 'todo' | 'urgent' | 'doing' | 'processing';
      type: 'event';
    };

export const notices: NoticeItem[] = [
  {
    id: '000000001',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/MSbDR4FR2MUAAAAAAAAAAAAAFl94AQBr',
    title: 'You have received 14 new weekly reports',
    datetime: '2017-08-09',
    type: 'notification',
  },
  {
    id: '000000002',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/hX-PTavYIq4AAAAAAAAAAAAAFl94AQBr',
    title: 'Your referral, Nini Qu, has passed the third round of interviews',
    datetime: '2017-08-08',
    type: 'notification',
  },
  {
    id: '000000003',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/jHX5R5l3QjQAAAAAAAAAAAAAFl94AQBr',
    title: 'This template can distinguish between multiple notification types',
    datetime: '2017-08-07',
    read: true,
    type: 'notification',
  },
  {
    id: '000000004',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/Wr4mQqx6jfwAAAAAAAAAAAAAFl94AQBr',
    title: 'The icon on the left distinguishes between different types',
    datetime: '2017-08-07',
    type: 'notification',
  },
  {
    id: '000000005',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/Mzj_TbcWUj4AAAAAAAAAAAAAFl94AQBr',
    title:
      'Content should not exceed two lines; it is truncated automatically if it does',
    datetime: '2017-08-07',
    type: 'notification',
  },
  {
    id: '000000006',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/eXLzRbPqQE4AAAAAAAAAAAAAFl94AQBr',
    title: 'Lily Qu commented on you',
    description: 'Description text description text description text',
    datetime: '2017-08-07',
    type: 'message',
    clickClose: true,
  },
  {
    id: '000000007',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/w5mRQY2AmEEAAAAAAAAAAAAAFl94AQBr',
    title: 'Emma Zhu replied to you',
    description:
      'This template notifies you who interacted with you; the avatar on the left shows "who"',
    datetime: '2017-08-07',
    type: 'message',
    clickClose: true,
  },
  {
    id: '000000008',
    avatar:
      'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/wPadR5M9918AAAAAAAAAAAAAFl94AQBr',
    title: 'Title',
    description:
      'This template notifies you who interacted with you; the avatar on the left shows "who"',
    datetime: '2017-08-07',
    type: 'message',
    clickClose: true,
  },
  {
    id: '000000009',
    title: 'Task Name',
    description: 'The task needs to start before 2017-01-12 20:00',
    extra: 'Not Started',
    status: 'todo',
    type: 'event',
  },
  {
    id: '000000010',
    title: 'Third-Party Urgent Code Change',
    description:
      'Submitted by Guanlin on 2017-01-06; the code change task must be completed before 2017-01-07',
    extra: 'Due Soon',
    status: 'urgent',
    type: 'event',
  },
  {
    id: '000000011',
    title: 'Information Security Exam',
    description: 'Assigned to Zhuer to complete the update and publish before 2017-01-09',
    extra: 'Elapsed 8 Days',
    status: 'doing',
    type: 'event',
  },
  {
    id: '000000012',
    title: 'ABCD Version Release',
    description:
      'Submitted by Guanlin on 2017-01-06; the code change task must be completed before 2017-01-07',
    extra: 'In Progress',
    status: 'processing',
    type: 'event',
  },
];
