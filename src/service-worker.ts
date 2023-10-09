import { onMessage } from 'webext-bridge'

onMessage('get-preferences', () => {
  return 'test 12'
})

export { }
