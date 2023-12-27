<script setup lang="ts">
import {
  SearchQuery,
  closeSearchPanel,
  findNext,
  findPrevious,
  selectMatches,
  setSearchQuery,
} from '@codemirror/search'
import type { EditorView } from '@codemirror/view'
import Input from '../components/base/Input.vue'

const view = inject<EditorView>('view')!
const inputRef = ref<InstanceType<typeof Input> | null>(null)
const search = ref('')
const caseSensitive = ref(false)
const regexp = ref(false)
const wholeWord = ref(false)

function commit(e: KeyboardEvent) {
  const query = new SearchQuery({
    search: search.value,
    caseSensitive: caseSensitive.value,
    regexp: regexp.value,
    wholeWord: wholeWord.value,
  })
  view.dispatch({ effects: setSearchQuery.of(query) })
}

function enter(e: KeyboardEvent) {
  (e.shiftKey ? findPrevious : findNext)(view)
}

onMounted(() => {
  // Hack to focus custom input
  // https://discuss.codemirror.net/t/automatic-search-input-focus-only-works-when-panel-already-exists/5628/2
  nextTick(() => {
    inputRef.value?.select()
  })
})
</script>

<template>
  <div class="relative flex items-center gap-2 bg-gray1 px-2 py-1.5" @keydown.esc="closeSearchPanel(view)">
    <Input ref="inputRef" v-model="search" main-field="true" size="tiny" placeholder="Find" @onchange="commit" @keyup="commit" @keydown.enter.prevent="enter" />
    <Button size="tiny" @click.prevent="findNext(view)">
      Next
    </Button>
    <Button size="tiny" @click.prevent="findPrevious(view)">
      Previous
    </Button>
    <Button size="tiny" @click.prevent="selectMatches(view)">
      All
    </Button>
    <div class="flex items-center gap-1 text-gray-10">
      <Checkbox id="matchCase" v-model="caseSensitive" size="tiny" @update:model-value="commit" />
      <label for="matchCase" class="text-bold text-tiny">match case</label>
    </div>
    <div class="flex items-center gap-1 text-gray-10">
      <Checkbox id="regexp" v-model="regexp" size="tiny" @update:model-value="commit" />
      <label for="regexp" class="text-bold text-tiny">regexp</label>
    </div>
    <div class="flex items-center gap-1 text-gray-10">
      <Checkbox id="wholeWord" v-model="wholeWord" size="tiny" @update:model-value="commit" />
      <label for="wholeWord" class="text-bold text-tiny">by word</label>
    </div>
    <div class="absolute right-3 top-0 h-full flex items-center justify-center">
      <button class="i:close p-1 text-base text-gray8 hover:text-gray11" @click="closeSearchPanel(view)" />
    </div>
  </div>
</template>
