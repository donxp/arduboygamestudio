
new Vue({
    el: '#app',
    data: {
        showSpriteContainer: false
    },
    mounted: function() {
        window.workspace = Blockly.inject('blocklyDiv',
        {toolbox: document.getElementById('toolbox')});
    },
    methods: {
        toggleShowSpriteContainer() {
            this.showSpriteContainer = !this.showSpriteContainer
            this.$nextTick(function() {
                console.log('Resizing')
                console.log(workspace)
                Blockly.svgResize(workspace)
            })
        }
    }
})