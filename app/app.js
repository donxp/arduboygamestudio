var Blockly = require('blockly')

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