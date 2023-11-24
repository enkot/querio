<script lang="ts" setup>
const props = withDefaults(defineProps<{
  code: string
  mode?: string
}>(), {
  mode: 'json',
})

const codeRef = ref(null)

useCodemirror(codeRef, computed(() => props.code), {
  mode: () => props.mode,
  readOnly: true,
})

const cleanup = onCtrlF()

onUnmounted(() => cleanup?.())

function onCtrlF(cb?: () => void) {
  const body = document.querySelector('body')
  if (!body)
    return

  const getIsCommandKeyPressed = (event: KeyboardEvent) => {
    return event.code === 'MetaLeft' || event.code === 'ControlLeft'
  }

  let isCommandKeyPressed = false
  const handleKeyDown = (event: KeyboardEvent) => {
    if (getIsCommandKeyPressed(event)) {
      isCommandKeyPressed = true
    }
    else if (event.code === 'KeyF' && isCommandKeyPressed) {
      event.preventDefault()
      event.stopPropagation()
      cb?.()
    }
  }
  const handleKeyUp = (event: KeyboardEvent) => {
    if (getIsCommandKeyPressed(event))
      isCommandKeyPressed = false
  }
  body.addEventListener('keydown', handleKeyDown)
  body.addEventListener('keyup', handleKeyUp)

  return () => {
    body.removeEventListener('keydown', handleKeyDown)
    body.removeEventListener('keyup', handleKeyUp)
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div ref="codeRef" class="flex flex-1 flex-col focus:no-underline" />
    <CopyButton :value="code" class="absolute bottom-2 right-4 flex-shrink-0" />
  </div>
</template>
