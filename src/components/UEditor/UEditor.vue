<template>
  <div class="ueditor">
    <Editor :id="id" :height="height"></Editor>
  </div>
</template>
<script>
export default {
  name: 'UEditor',
  data () {
    return {
      id: '',
      editor: null,
      editorContent: '',
      ready: false,
      timer: 0,
      destroyed: false
    }
  },
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    content: {
      type: String
    },
    height: {
      type: Number,
      default: 300
    },
    maxlength: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Editor: {
      render (createElement) {
        return createElement('script', {
          attrs: {
            type: 'text/plain',
            id: this.id,
            style: 'width:100%;height:' + this.height + 'px'
          }
        })
      },
      props: {
        id: { type: String, required: true },
        height: { type: Number }
      }
    }
  },
  created () {
    this.id =
      'editor' +
      new Date().getTime() +
      parseInt(Math.random() * 10000000).toString()
  },
  mounted () {
    let self = this
    this.$nextTick(async () => {
      let config = {
        autoFloatEnabled: false,
        zIndex: 99,
        readonly: this.readonly
      }
      if (this.maxlength > 0) {
        config.maximumWords = this.maxlength
      }
      let editor = window.UE.getEditor(this.id, config)
      editor.ready(() => {
        this.ready = true
        editor.setContent(this.content || '')
        this.timer = setInterval(() => {
          if (this.destroyed) {
            return
          }
          self.editorContent = editor.getContent()
          self.$emit('change', self.editorContent)
        }, 500)
      })
      this.editor = editor
    })
  },
  watch: {
    content: function (newVal) {
      if (newVal === this.editorContent) {
        return
      }
      if (!this.ready || this.destroyed) {
        return
      }
      this.editor.setContent(newVal || '')
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.destroyed = true
    this.editor.destroy()
  }
}
</script>
<style lang="scss" scoped>
.ueditor {
  line-height: 1;
}
</style>
