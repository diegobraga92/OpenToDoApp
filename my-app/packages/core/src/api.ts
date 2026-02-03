// packages/core/src/api.ts
export async function fetchPayments() {
  return fetch("/api/payments").then(r => r.json());
}
