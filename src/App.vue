<template>
  <div id="app">
    <header class="shadow-md text-center fixed top-0 w-full">
      <h1 class="text-yellow-300 text-3xl uppercase">
        <a href="/" title="Notes">
          <fa-icon :icon="['far', 'lightbulb']" /> Notes
        </a>
      </h1>
    </header>

    <main>
      <transition name="slide-fade" mode="out-in">
        <div class="h-full bg-yellow-200 rounded-lg" v-if="activeNote.id" key="activeNote">
          <div class="text-center">
            <button @click="close">
              <fa-icon icon="grip-lines" size="lg" />
            </button>
          </div>

          <editor-content class="editor outline-none px-3" :editor="editor" />
        </div>

        <div class="container flex flex-row flex-wrap text-white mx-auto mt-5" v-else key="notes">
          <a
            class="h-32 w-24 bg-green-900 rounded flex items-center justify-center m-3"
            href="#"
            title="New note"
            @click="create">
            <fa-icon class="text-yellow-300" icon="plus" size="lg" />
          </a>

          <transition name="fade">
            <a
              class="h-32 w-24 bg-yellow-300 rounded flex items-center justify-center m-3 relative"
              href="#"
              :key="note.id"
              :title="getNoteName(note)"
              v-for="(note) in notes"
              @click="open(note)">
              <button class="absolute top-0 right-0 p-1" @click.stop="discard(note)">
                <fa-icon
                  class="text-red-600"
                  fixed-width
                  :icon="['far', 'trash-alt']"
                />
              </button>

              <span class="text-black text-center truncate">
                {{ getNoteName(note) }}
              </span>
            </a>
          </transition>

          <div class="file" :key="i" v-for="(note, i) in notes"></div>
        </div>
      </transition>
    </main>

    <footer class="shadow-md shadow-inner bg-yellow-300 text-center p-2 fixed bottom-0 w-full">
      Made with <fa-icon class="text-red-700" icon="heart" /> by <strong>Mayur Shingrakhiya</strong>
    </footer>
  </div>
</template>

<script>
import { Doc as BaseDoc, Editor, EditorContent, Node } from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  HardBreak,
  Heading,
  History,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Placeholder,
  TodoItem,
  TodoList
} from 'tiptap-extensions'

var interval

class Doc extends BaseDoc {
  get schema () {
    return {
      content: 'title block+'
    }
  }
}

class Title extends Node {
  get name () {
    return 'title'
  }

  get schema () {
    return {
      content: 'inline*',
      parseDOM: [{
        tag: 'h3'
      }],
      toDOM: () => ['h3', { class: 'text-3xl mb-3' }, 0]
    }
  }
}

export default {
  name: 'App',
  components: {
    EditorContent
  },
  data () {
    return {
      editor: new Editor({
        autoFocus: true,
        extensions: [
          new Doc(),
          new Title(),
          new Blockquote(),
          new Bold(),
          new BulletList(),
          new Code(),
          new CodeBlock(),
          new HardBreak(),
          new Heading(),
          new History(),
          new Italic(),
          new Link(),
          new ListItem(),
          new OrderedList(),
          new Placeholder({
            showOnlyCurrent: false,
            emptyNodeText: node => {
              if (node.type.name === 'title') {
                return 'Title'
              }

              return 'Note'
            }
          }),
          new TodoItem(),
          new TodoList()
        ],
        onUpdate: ({ getJSON }) => {
          clearInterval(interval)
          interval = setTimeout(json => this.save(json), 1000, getJSON())
        }
      }),
      notes: [],
      activeNote: { id: null, content: {} }
    }
  },

  created () {
    this.notes = JSON.parse(localStorage.getItem('notes') || '[]')
  },

  beforeDestroy () {
    this.editor.destroy()
  },

  methods: {
    /**
     * Create a new note.
     */
    create () {
      this.activeNote = {
        id: 'note-' + (new Date()).getTime(),
        content: {}
      }

      this.editor.clearContent(false)
    },

    /**
     * Open an existing note.
     */
    open (note) {
      this.activeNote = note

      if (note.content.type) {
        this.editor.setContent(note.content, false)
      }
    },

    /**
     * Close an active note.
     */
    close () {
      let note = this.notes.find(n => n.id === this.activeNote.id)

      if (note && note.id) {
        note = this.activeNote
      } else if (this.activeNote.content.type) {
        this.notes.unshift(this.activeNote)
      }

      localStorage.setItem('notes', JSON.stringify(this.notes))

      this.activeNote = { id: null, content: {} }
    },

    /**
     * Delete the note from the storage.
     */
    discard (note) {
      if (confirm('Are you sure you want to delete this note?')) {
        this.notes = this.notes.filter(n => n.id !== note.id)

        localStorage.setItem('notes', JSON.stringify(this.notes))
      }
    },

    /**
     * Save editor content to the note.
     */
    save (json) {
      this.activeNote.content = json
    },

    /**
     * Get the name of the note. (Returns title otherwise the timestamp of creation prepended with note-)
     */
    getNoteName (note) {
      if (note.content.content[0].content) {
        return note.content.content[0].content[0].text
      }

      return note.id
    }
  }
}
</script>

<style>
:root {
  --header-height: 45px;
  --footer-height: 40px;
}

html, body {
  height: 100%;
}

body {
  background: #093028;
  background: -webkit-linear-gradient(to right, #237A57, #093028);
  background: linear-gradient(to right, #237A57, #093028);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100%;
  padding: var(--header-height) 0 var(--footer-height) 0;
}

button:active, button:focus {
  outline: none;
}

main {
  height: 100%;
  padding: 1rem 0.25rem 0.5rem;
}

.editor *.is-empty:nth-child(1)::before,
.editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #221d22;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

.editor .ProseMirror {
  outline: unset;
}

.editor {
  height: calc(100% - 24px);
  overflow-y: auto;
}

.slide-fade-enter {
  transform: translateY(25px);
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-leave-to {
  transform: translateY(25px);
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>
