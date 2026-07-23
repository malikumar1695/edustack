/**
 * Ported from ant-design-pro-master/src/pages/form/advanced-form/_mock.ts
 * (`POST /api/advancedForm`). The real handler ignores the request body and
 * always responds `{ message: 'Ok' }` with no artificial delay, so this
 * just mirrors that shape directly — no network call, no backend.
 */
export async function fakeSubmitForm(params: Record<string, any>) {
  return { message: "Ok" };
}
