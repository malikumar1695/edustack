/**
 * Ported from ant-design-pro-master/src/pages/user/register/_mock.ts
 * (`POST /api/register`). The mock always returns success regardless of
 * input, so this just mirrors that directly instead of over HTTP.
 */
export type RegisterParams = {
  mail?: string;
  password?: string;
  confirm?: string;
  mobile?: string;
  captcha?: string;
  prefix?: string;
};

export async function fakeRegister(_payload: RegisterParams) {
  return { status: "ok", currentAuthority: "user" };
}
