<script lang="ts" setup>
import 'codemirror-graphql/mode'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/selection/active-line.js'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/fold/foldgutter.css'
import '~/styles/dracula.css'

import type { EditorConfiguration } from 'codemirror'
import Codemirror from 'codemirror-editor-vue3'

const props = defineProps<{
  code: string
  options: EditorConfiguration
}>()

const codeEditorRef = ref<any>(null)

const options = computed<EditorConfiguration>(() => ({
  mode: {
    name: 'javascript',
    json: true,
  },
  theme: 'dracula',
  tabSize: 4,
  foldGutter: true,
  styleActiveLine: true,
  lineNumbers: true,
  readOnly: true,
  scrollbarStyle: 'overlay',
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  ...props.options,
  // dialogOptions: {
  //   closeOnEnter: false,
  // },
}))

defineExpose({
  refresh() {
    codeEditorRef.value?.refresh()
  },
})
</script>

<template>
  <Codemirror
    ref="codeEditorRef"
    :value="code"
    :options="options"
    :original-style="true"
  />
</template>

<style>
.CodeMirror {
  height: 100% !important;
  background: none !important;
  font-size: 13px;
  font-weight: 500;
  font-family: monospace;
}
.CodeMirror {
  @apply bg-gray1;
}
.CodeMirror-overlayscroll-horizontal div,
.CodeMirror-overlayscroll-vertical div {
  @apply bg-gray4A! rounded-full! m-[1px];
}
.CodeMirror-overlayscroll-horizontal,
.CodeMirror-overlayscroll-vertical {
  @apply h-[7px]! w-[7px]!;
}
.CodeMirror-scrollbar-filler,
.CodeMirror-gutter-filler {
  background-color: transparent !important;
}
</style>
