const { ipcRenderer } = require('electron')
require('./app/components/Tabs.js')
require('./app/components/ProjectActions.js')
require('./app/components/Preferences.js')
let ard = require('./app/util/ArduHelper.js')
require('./app/components/SpriteCreator.js')

var vm = new Vue({
    el: '#app',
    data: {
        workspaceLoaded: false,
        showSpriteContainer: false,
        selectedPort: '',
        showSprites: false,
        sprites: [
            {
                name: 'sprite1'
            }
        ],
        spriteCreatorWidth: 8,
        spriteCreatorHeight: 8,
        spriteCreatorImage: [],
        preferencesModal: false
    },
    mounted: function() {
        window.workspace = Blockly.inject('blocklyDiv',
        {
            toolbox: document.getElementById('toolbox')
        });
        window.workspace.addChangeListener(window.updateCode)
        ard.setup()
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
        showPreferences() {
            this.$refs.preferencesModal.showModal()
        },
        projectLoaded() {
            this.$refs.tabs._updateTabs()
        },
        toggleShowSpriteContainer() {
            this.showSpriteContainer = !this.showSpriteContainer
            this.$nextTick(function() {
                Blockly.svgResize(workspace)
            })
        },
        toggleShowSprites() {
            this.showSprites = !this.showSprites
            this.$nextTick(function() {
                Blockly.svgResize(workspace)
            })
        }
    }
})