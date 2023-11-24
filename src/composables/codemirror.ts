import type { ViewUpdate } from '@codemirror/view'
import {
  EditorView,
  placeholder,
} from '@codemirror/view'
import type { Extension } from '@codemirror/state'
import {
  Compartment,
  EditorState,
} from '@codemirror/state'
import type { Language } from '@codemirror/language'
import {
  LanguageSupport,
  StreamLanguage,
} from '@codemirror/language'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { xmlLanguage } from '@codemirror/lang-xml'
import { htmlLanguage } from '@codemirror/lang-html'
import { jsonLanguage } from '@codemirror/lang-json'
import { html } from '@codemirror/legacy-modes/mode/xml'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { GQLLanguage } from '../../codemirror-lang-graphql/dist'
import {
  baseTheme,
  basicSetup,
} from '~/codemirror/theme'

interface CodeMirrorOptions {
  mode: MaybeRefOrGetter<string>
  placeholder: string
  readOnly: boolean
  lineWrapping: boolean

  // callback on editor update
  onUpdate?: (view: ViewUpdate) => void
}

export function isJSONContentType(contentType: string) {
  return /\bjson\b/i.test(contentType)
}

const langExtensions = (
  language: Language | undefined,
): Extension | LanguageSupport => {
  const exts: Extension[] = []
  return language ? new LanguageSupport(language, exts) : exts
}

const getLanguage = (langMime: string): Language | null => {
  if (isJSONContentType(langMime))
    return jsonLanguage

  else if (langMime === 'application/javascript')
    return javascriptLanguage

  else if (langMime === 'graphql')
    return GQLLanguage

  else if (langMime === 'application/xml')
    return xmlLanguage

  else if (langMime === 'text/html')
    return htmlLanguage

  else if (langMime === 'htmlmixed')
    return StreamLanguage.define(html)

  else if (langMime === 'application/x-sh')
    return StreamLanguage.define(shell)

  else if (langMime === 'text/x-yaml')
    return StreamLanguage.define(yaml)

  // None matched, so return null
  return null
}

const getEditorLanguage = (
  langMime: string,
): Extension => langExtensions(getLanguage(langMime) ?? undefined)

export function useCodemirror(
  el: Ref<any | null>,
  value: Ref<string | undefined>,
  options: Partial<CodeMirrorOptions>,
) {
  const language = new Compartment()
  const lineWrapping = new Compartment()
  const placeholderConfig = new Compartment()

  const cachedValue = ref(value.value)

  const view = ref<EditorView>()

  const initView = (el: any) => {
    const extensions = [
      basicSetup,
      baseTheme,
      EditorView.updateListener.of((update) => {
        if (options.readOnly)
          update.view.contentDOM.inputMode = 'none'
      }),
      EditorState.changeFilter.of(() => !options.readOnly),
      placeholderConfig.of(
        placeholder(options.placeholder ?? ''),
      ),
      language.of(
        getEditorLanguage(
          toValue(options.mode) ?? '',
        ),
      ),
      lineWrapping.of(
        options.lineWrapping
          ? [EditorView.lineWrapping]
          : [],
      ),
    ]

    view.value = new EditorView({
      parent: el,
      state: EditorState.create({
        doc: value.value,
        extensions,
      }),
    })
  }

  onMounted(() => {
    if (el.value) {
      if (!view.value)
        initView(el.value)
    }
  })

  watch(el, () => {
    if (el.value) {
      if (view.value)
        view.value.destroy()
      initView(el.value)
    }
    else {
      view.value?.destroy()
      view.value = undefined
    }
  })

  onBeforeUnmount(() => {
    view.value?.destroy()
  })

  watch(value, (newVal) => {
    if (newVal === undefined) {
      view.value?.destroy()
      view.value = undefined
      return
    }

    if (!view.value && el.value)
      initView(el.value)

    if (cachedValue.value !== newVal) {
      view.value?.dispatch({
        filter: false,
        changes: {
          from: 0,
          to: view.value.state.doc.length,
          insert: newVal,
        },
      })
    }
    cachedValue.value = newVal
  })

  watch(
    () => toValue(options.mode),
    () => {
      view.value?.dispatch({
        effects: language.reconfigure(
          getEditorLanguage(
            (toValue(options.mode) as any) ?? '',
          ),
        ),
      })
    },
  )

  watch(
    () => options.lineWrapping,
    (newMode) => {
      view.value?.dispatch({
        effects: lineWrapping.reconfigure(
          newMode ? [EditorView.lineWrapping] : [],
        ),
      })
    },
  )

  watch(
    () => options.placeholder,
    (newValue) => {
      view.value?.dispatch({
        effects: placeholderConfig.reconfigure(placeholder(newValue ?? '')),
      })
    },
  )
}
