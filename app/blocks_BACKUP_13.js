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

<<<<<<< HEAD
    Blockly.Blocks['randomrange'] = {       //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ida2k6
        init: function() {
          this.appendValueInput("min")
              .setCheck("Number")
              .appendField("Random Range  min");
          this.appendValueInput("max")
              .setCheck("Number")
              .appendField("max");
          this.setInputsInline(true);
          this.setOutput(true, "Number");
          this.setColour(105);
       this.setTooltip("");
       this.setHelpUrl("");
        }
      };

      Blockly.Blocks['checkforbuttonpress'] = { //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#tmdw4b
        init: function() {
          this.appendDummyInput()
              .appendField("When ")
              .appendField(new Blockly.FieldDropdown([["up","UPBUTTON"], ["down","DOWNBUTTON"], ["left","LEFTBUTTON"], ["right","RIGHTBUTTON"], ["A","ABUTTON"], ["B","BUTTON"]]), "NAME")
              .appendField("is pressed");
          this.setNextStatement(true, null);
          this.setColour(230);
       this.setTooltip("");
       this.setHelpUrl("");
        }
      };

      Blockly.Blocks['changexpos'] = {  //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#kr8xqa
        init: function() {
          this.appendValueInput("newxpos")
              .setCheck("Number")
              .appendField("Change X position to");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(230);
       this.setTooltip("");
       this.setHelpUrl("");
        }
      };


    Blockly.Blocks['changeypos'] = {  //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#kr8xqa
        init: function() {
          this.appendValueInput("newypos")
              .setCheck("Number")
              .appendField("Change Y position to");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(230);
       this.setTooltip("");
       this.setHelpUrl("");
        }
      };

    Blockly.Blocks['beginblock'] = {  //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#sxxy4y
        init: function() {
          this.appendDummyInput()
              .appendField("When Game Begins");
          this.setNextStatement(true, null);
          this.setColour(230);
       this.setTooltip("");
       this.setHelpUrl("");
        }
      };

      Blockly.Blocks['collisionwithany'] = {  //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vjt3o8
        init: function() {
          this.appendDummyInput()
              .appendField("When collides with anything");
          this.setNextStatement(true, null);
          this.setColour(230);
       this.setTooltip("");
       this.setHelpUrl("");
        }
      };

      




=======
    blocks['text'] = {
        /**
         * Block for text value.
         * @this Blockly.Block
         */
        init: function() {
          this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
          this.setColour(1);
          this.appendDummyInput()
              .appendField(this.newQuote_(true))
              .appendField(new Blockly.FieldTextInput(''), 'TEXT')
              .appendField(this.newQuote_(false));
          this.setOutput(true, Blockly.Types.TEXT.output);
          // Assign 'this' to a variable for use in the tooltip closure below.
          var thisBlock = this;
          // Text block is trivial.  Use tooltip of parent block if it exists.
          this.setTooltip(function() {
            var parent = thisBlock.getParent();
            return (parent && parent.getInputsInline() && parent.tooltip) ||
                Blockly.Msg.TEXT_TEXT_TOOLTIP;
          });
        },
        /**
         * Create an image of an open or closed quote.
         * @param {boolean} open True if open quote, false if closed.
         * @return {!Blockly.FieldImage} The field image of the quote.
         * @this Blockly.Block
         * @private
         */
        newQuote_: function(open) {
          if (open == this.RTL) {
            var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
          } else {
            var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
          }
          return new Blockly.FieldImage(file, 12, 12, '"');
        },
        /** @return {!string} Type of the block, text block always a string. */
        getBlockType: function() {
          return Blockly.Types.TEXT;
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
>>>>>>> 90088fab77e35853d8b3b9dd5c30215576be4326
}