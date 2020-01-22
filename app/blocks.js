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

      




}