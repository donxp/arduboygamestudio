var Blockly = require('blockly')

/* Setup generator */
// require('./generators/cpp')

Blockly.Blocks['string_length'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck('String')
            .appendField('length of');
        this.setOutput(true, 'Number')
        this.setColour(345);
        this.setTooltip("Gets the length of a string");
        this.setHelpUrl("");
    }
  };

var workspace = Blockly.inject('blocklyDiv',
    {toolbox: document.getElementById('toolbox')});

function updateCode() {
    console.log('Updating textarea')
    var code = Blockly.cpp.workspaceToCode(workspace)
    document.getElementById('code').value = code
}

workspace.addChangeListener(updateCode)