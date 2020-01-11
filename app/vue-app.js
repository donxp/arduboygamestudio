const { ipcRenderer } = require('electron')
require('./app/components/Tabs.js')

new Vue({
    el: '#app',
    data: {
        workspaceLoaded: false,
        showSpriteContainer: false,
        sprites: [
            {
                name: 'sprite1'
            }
        ],
        spriteCreatorWidth: 8,
        spriteCreatorHeight: 8,
        spriteCreatorImage: []
    },
    mounted: function() {
        window.workspace = Blockly.inject('blocklyDiv',
        {toolbox: document.getElementById('toolbox')});
        window.workspace.addChangeListener(window.updateCode)

        this.workspaceLoaded = true
    },
    watch: {
        spriteCreatorWidth: function() {
            this.draw()
        },
        spriteCreatorHeight: function() {
            this.draw()
        }
    },
    methods: {
        toggleShowSpriteContainer() {
            this.showSpriteContainer = !this.showSpriteContainer
            this.$nextTick(function() {
                Blockly.svgResize(workspace)
            })
        },
        addSprite() {
            // this.sprites.push({
            //     name: 'new sprite'
            // })
            // ipcRenderer.send('open_add_sprite_dialog')
            // console.log(res)
            $('#sprite-creator-modal').modal('show')
            this.spriteCreatorDrawGrid()
        },
        spriteCreatorDrawGrid() {
            const ctx = this.$refs.spriteCreator.getContext('2d')
            
            const width = this.$refs.spriteCreator.width
            const height = this.$refs.spriteCreator.height

            ctx.clearRect(0, 0, width, height);
            // draw width lines
            const lineWidth = width / this.spriteCreatorWidth

            for(let i = 1; i <= this.spriteCreatorWidth; i++) {
                this.spriteCreatorImage.length = this.spriteCreatorWidth
                if(this.spriteCreatorImage[i-1] === undefined) {
                    this.spriteCreatorImage[i-1] = []
                }
                if(i === this.spriteCreatorWidth) {
                    break
                }
                let curX = lineWidth * i
                ctx.beginPath()
                ctx.moveTo(curX, 0)
                ctx.lineTo(curX, height)
                ctx.stroke()
            }

            // draw height lines
            const lineHeight = height / this.spriteCreatorHeight
            for(let i = 1; i <= this.spriteCreatorHeight; i++) {
                if(i === this.spriteCreatorHeight) {
                    break
                }
                let curY = lineHeight * i
                ctx.beginPath()
                ctx.moveTo(0, curY)
                ctx.lineTo(width, curY)
                ctx.stroke()
            }
        },
        spriteCreatorCanvasClick(event) {
            const canvas = this.$refs.spriteCreator
            const canvasRect = canvas.getBoundingClientRect()
            const width = canvas.width
            const height = canvas.height
            const x = event.clientX - canvasRect.left
            const y = event.clientY - canvasRect.top

            const col = Math.ceil(x / (width / this.spriteCreatorWidth))
            const row = Math.ceil(y / (height / this.spriteCreatorHeight))
            this.handleSpriteCreatorGridClick(row, col)
        },
        handleSpriteCreatorGridClick(row, col) {
            console.log('row: ' + row + ' col: ' + col)
        },
        spriteCreatorSave() {
            // save sprite
        }
    }
})