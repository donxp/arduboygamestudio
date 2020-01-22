module.exports = function(blocks) {
    blocks['string_length'] = {
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

    /* variables */
    blocks['variables_set'] = {
        /**
         * Block for variable setter.
         * @this Blockly.Block
         */
        init: function() {
          this.jsonInit({
            "message0": Blockly.Msg.VARIABLES_SET,
            "args0": [
              {
                "type": "field_variable",
                "name": "VAR",
                "variable": Blockly.Msg.VARIABLES_DEFAULT_NAME
              },
              {
                "type": "input_value",
                "name": "VALUE"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": Blockly.Blocks.variables.HUE,
            "tooltip": Blockly.Msg.VARIABLES_SET_TOOLTIP,
            "helpUrl": Blockly.Msg.VARIABLES_SET_HELPURL
          });
          this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        },
        contextMenuType_: 'variables_get',
        customContextMenu: Blockly.Blocks['variables_get'].customContextMenu,
        /**
         * Searches through the nested blocks to find a variable type.
         * @this Blockly.Block
         * @param {!string} varName Name of this block variable to check type.
         * @return {string} String to indicate the type of this block.
         */
        getVarType: function(varName) {
          return Blockly.Types.getChildBlockType(this);
        }
      };
}