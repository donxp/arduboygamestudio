const { ipcRenderer } = require('electron')
require('./app/components/Tabs.js')
require('./app/components/ProjectActions.js')
require('./app/components/SpriteCreator.js')

new Vue({
    el: '#app',
    data: {
        workspaceLoaded: false,
        showSpriteContainer: false,
        showSprites: false,
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
        projectLoaded() {
            console.log('project loaded')
            this.$refs.tabs._updateTabs()
        },
        toggleShowSpriteContainer() {
            this.showSpriteContainer = !this.showSpriteContainer
            this.$nextTick(function() {
                Blockly.svgResize(workspace)
            })
        },
        addSprite() {
            // $('#sprite-creator-modal').modal('show')
            // this.spriteCreatorDrawGrid()
        },
        toggleShowSprites() {
            this.showSprites = !this.showSprites
            this.$nextTick(function() {
                Blockly.svgResize(workspace)
            })
        },
        spriteCreatorSave() {
            // save sprite
        }
    }
})