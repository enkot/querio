<template>
  <div class="relative h-full">
    <transition
      enter-active-class="transition duration-200 ease-in-out"
      leave-active-class="transition duration-200 ease-in-out"
      enter-class="opacity-0 transform scale-75"
      leave-to-class="opacity-0 transform scale-75"
      appear
    >
      <div v-show="searchOpened" class="absolute flex items-center right-3 w-48 sm:w-64 bg-gray-100 dark:bg-gray-800 rounded-sm shadow-md z-20 pr-2">
        <input
          ref="keyword"
          v-model="keyword"
          type="text"
          class="block px-3 py-2 text-xs w-full dark:text-white border-0 border-transparent bg-transparent focus:ring-0 sm:text-sm"
          placeholder="Search"
          @keyup.enter="search(false)"
        />
        <div class="flex items-center space-x-0.5">
          <span class="px-1 text-gray-500 font-semibold">
            {{ searchCount ? searchCurrent : 0 }}/{{ searchCount }}
          </span>
          <Button @click="search(true)">
            <ChevronUpIcon class="h-4 w-4"/>
          </Button>
          <Button @click="search(false)">
            <ChevronDownIcon class="h-4 w-4"/>
          </Button>
          <Button @click="closeSearch" @keyup.esc="closeSearch" tabindex="0"> 
            <CloseIcon class="h-4 w-4"/>
          </Button>
        </div>
      </div>
    </transition>
    <codemirror ref="cmEditor" :value="data" :options="options" class="h-full" :class="{ 'search-opened': searchOpened }"/>
  </div>
</template>

<script>
import { CodeMirror } from 'vue-codemirror'
import ChevronUpIcon from '@/assets/chevron-up.svg'
import ChevronDownIcon from '@/assets/chevron-down.svg'
import CloseIcon from '@/assets/close.svg'

export default {
  components: {
    ChevronUpIcon,
    ChevronDownIcon,
    CloseIcon
  },
  props: {
    data: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      searchOpened: false,
      keyword: '',
      lastKeyword: '',
      cursor: null,
      searchCount: 0,
      searchCurrent: 0
    }
  },
  methods: {
    toggleSearch() {
      this.searchOpened ? this.closeSearch() : this.openSearch()
    },
    openSearch() {
      this.searchOpened = true
      this.$nextTick(() => this.$refs.keyword.focus())
    },
    closeSearch() {
      const { codemirror } = this.$refs.cmEditor
      
      this.searchOpened = false
      if (codemirror) {
        this.clearMarks()
        this.cursor && codemirror.setCursor(this.cursor.to())
        codemirror.focus()
      }
      this.lastKeyword = ''
      this.cursor = null
    },
    clearMarks() {
      const { codemirror } = this.$refs.cmEditor
      codemirror.doc.getAllMarks().forEach(marker => marker.clear())
      this.searchCurrent = 0
      this.searchCount = 0
    },
    search(rev = false) {
      const { codemirror } = this.$refs.cmEditor
      const caseFold = typeof this.keyword == "string" && this.keyword == this.keyword.toLowerCase()

      if (this.keyword === this.lastKeyword && this.cursor) {
        if (!this.cursor.find(rev)) {
          this.cursor = codemirror.getSearchCursor(this.keyword, rev ? CodeMirror.Pos(codemirror.lastLine()) : CodeMirror.Pos(codemirror.firstLine()), { caseFold });
          if (!this.cursor.find(rev)) return;
        }

        this.searchCurrent = (rev 
          ? (this.searchCurrent === 1 ? this.searchCount: this.searchCurrent - 1)
          : (this.searchCurrent === this.searchCount ? 1 : this.searchCurrent + 1))

        codemirror.setSelection(this.cursor.from(), this.cursor.to())
        codemirror.setCursor(this.cursor.to())
        codemirror.scrollIntoView({from: this.cursor.from(), to: this.cursor.to()}, 20)
      } else {
        this.cursor = codemirror.getSearchCursor(this.keyword, CodeMirror.Pos(codemirror.firstLine()), { caseFold })

        this.clearMarks()

        if (this.keyword !== this.lastKeyword && this.cursor) {
          while (this.cursor.findNext()) {
            this.searchCount++
            codemirror.markText(this.cursor.from(), this.cursor.to(), {
              className: 'search-highlight'
            })
          }
        }
      
        this.lastKeyword = this.keyword
        this.search()
      }
    },
    onCtrlF(cb = () => null) {
      const body = document.querySelector('body')
      if (!body) return

      const getIsCommandKeyPressed = (event) => {
        return event.code === 'MetaLeft' || event.code === 'ControlLeft'
      }

      let isCommandKeyPressed = false
      const handleKeyDown = (event) => {
        if (getIsCommandKeyPressed(event)) {
          isCommandKeyPressed = true;
        } else if (event.code === 'KeyF' && isCommandKeyPressed) {
          event.preventDefault()
          event.stopPropagation()
          cb()
        }
      }
      const handleKeyUp = (event) => {
        if (getIsCommandKeyPressed(event)) {
          isCommandKeyPressed = false
        }
      }
      body.addEventListener('keydown', handleKeyDown)
      body.addEventListener('keyup', handleKeyUp)

      return () => {
        body.removeEventListener('keydown', handleKeyDown)
        body.removeEventListener('keyup', handleKeyUp)
      };
    },
    onEscape(cb = () => null) {
      const body = document.querySelector('body')
      if (!body) return

      const handleKeyUp = (event) => {
        if (event.code === 'Escape') cb()     
      }
      body.addEventListener('keyup', handleKeyUp)

      return () => {
        body.removeEventListener('keyup', handleKeyUp)
      };
    },
    refresh() {
      this.$refs.cmEditor?.codemirror?.refresh()
    },
    checkFocused() {
      const { codemirror } = this.$refs.cmEditor

      return codemirror.hasFocus() || this.$refs.keyword === document.activeElement
    }
  },
  mounted() {
    const destroyOnCtrlF = this.onCtrlF(() => {
      if (this.checkFocused()) this.toggleSearch()
    })

    const destroyOnEscape = this.onEscape(() => {
      if (this.checkFocused()) this.closeSearch()
    })
    
    this.$once("hook:beforeDestroy", () => {
      destroyOnCtrlF()
      destroyOnEscape()
    })
  },
  
}
</script>