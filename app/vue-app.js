
new Vue({
    el: '#app',
    data: {
        showSpriteContainer: false,
        sprites: [
            {
                name: 'sprite1'
            }
        ]
    },
    mounted: function() {
        window.workspace = Blockly.inject('blocklyDiv',
        {toolbox: document.getElementById('toolbox')});

        workspace.addChangeListener(window.updateCode)
    },
    methods: {
        toggleShowSpriteContainer() {
            this.showSpriteContainer = !this.showSpriteContainer
            this.$nextTick(function() {
                console.log('Resizing')
                console.log(workspace)
                Blockly.svgResize(workspace)
            })
        },
        addSprite() {
            this.sprites.push({
                name: 'new sprite'
            })
        }
    }
})