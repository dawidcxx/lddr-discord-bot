export function assert(cond: boolean, hint: string) {
  if (cond === false) {
    throw new Error(`Assertion failed, reason: '${hint}'`)
  }
}
