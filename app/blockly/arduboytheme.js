goog.require('Blockly.Theme')

/**
 * Colours picked from https://i.imgur.com/e1rBGLT.jpg
 * Number 267
 * #ee3762 (pastel pink), #fe9e10 (orange), #edede8 (very light gray), #4ddadd (baby blue), #39b0b9 (bit darker than baby blue)
 */

module.exports = {
    init() {
        return Blockly.Theme.defineTheme('arduboy', {
            'base': Blockly.Themes.Classic,
            'componentStyles': {
                'workspace': '#edede8', // the main workspace where blocks are put
                'toolbox': '#39b0b9', // the left sidebar with all the categories
                'flyout': '#4ddadd', // the blocks that fly out when clicked on a category
                'flyoutOpacity': '0.5', // from 0 to 1
                'flyoutText': '#000', // text colour for the flyout, only affects labels
                'scrollbar': '#ee3762', // scrollbar colour
                'scrollbarOpacity': '0.8', // scrollbar opacity from 0 to 1
                'toolboxText': '#fff', // toolbox text colour
            },
            'blockStyles': {
                math_blocks: {
                    colourSecondary: '#000000'
                }
            }
        })
    }
}