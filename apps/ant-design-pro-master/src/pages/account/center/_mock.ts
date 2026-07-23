import type { Request, Response } from 'express';
import {
  avatars,
  defaultUser,
  desc,
  fakeList,
  titles,
} from '../../../../mock/utils';

function getProjectNotice() {
  return titles.slice(0, 6).map((title, i) => ({
    id: `xxx${i + 1}`,
    title,
    logo: avatars[i],
    description: desc[i % desc.length],
    updatedAt: i % 2 === 0 ? new Date() : new Date('2017-07-24'),
    member: [
      'Code Monkey Squad',
      'The Whole Team Looks Like Movie Stars',
      'Chuunibyou Girls Squad',
      'Programmer Life',
      'Fancy Design Squad',
      'Tricked You Into CS',
    ][i],
    href: '',
    memberLink: '',
  }));
}

function getFakeList(req: Request, res: Response) {
  const params = req.query as any;

  const count = Number(params.count) * 1 || 5;

  const result = fakeList(count);
  return res.json({
    data: {
      list: result,
    },
  });
}

function getCurrentUser(_req: Request, res: Response) {
  return res.json({
    data: {
      ...defaultUser,
      notice: getProjectNotice(),
    },
  });
}

export default {
  'GET  /api/fake_list_Detail': getFakeList,
  'GET  /api/currentUserDetail': getCurrentUser,
};
