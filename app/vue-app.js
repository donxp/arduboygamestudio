const { ipcRenderer } = require('electron')
require('./app/components/Tabs.js')
require('./app/components/ProjectActions.js')
require('./app/components/Preferences.js')
require('./app/components/Tutorials.js')
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
        preferencesModal: false,
        tutorialsModal: false,
        debugMode: false
    },
    mounted: function() {
        Blockly.Events.enable()
        window.workspace = Blockly.inject('blocklyDiv',
        {
            toolbox: document.getElementById('toolbox'),
            theme: Blockly.Themes.Arduboy,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                trashcan: true
            }
        });
        window.workspace.addChangeListener(window.updateCode)
        ard.setup()
        this.workspaceLoaded = true
        this.createDefaultBlocks()
    },
    watch: {
        spriteCreatorWidth: function() {
            this.draw()
        },
        spriteCreatorHeight: function() {
            this.draw()
        },
        debugMode: newVal => {
            this.$nextTick(() => {
                Blockly.svgResize(workspace)
            })
        }
    },
    methods: {
        showPreferences() {
            this.$refs.preferencesModal.showModal()
        },
        showTutorials() {
            this.$refs.tutorialsModal.showModal()
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
        },
        workspaceListener(e) {
            console.log('listener')
            console.log(e)
        },
        createDefaultBlocks() {
            const def = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="gamestart" id="#~V8#@JAs;t7i*,||N@4" x="270" y="256"><statement name="NAME"><block type="setsprite" id="[#YGhszk%m/T?YSv|;n-"><field name="OBJECTNAME">0,0,0</field></block></statement></block></xml>'
            setTimeout(() => {
                Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(def), window.workspace)
                window.workspace.scrollCenter()
            }, 5)
        }
    }
})