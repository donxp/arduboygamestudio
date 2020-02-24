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

  Blockly.Blocks.math_number.getBlockType = function() {
      return Blockly.Types.NUMBER
  }

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
          "colour": 1,
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
        this.setColour(137);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['checkforbuttonpress'] = {       //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ynbpt3
      init: function() {
        this.appendDummyInput()
            .appendField("Button")
            .appendField(new Blockly.FieldDropdown([["up","UP_BUTTON"], ["down","DOWN_BUTTON"], ["left","LEFT_BUTTON"], ["right","RIGHT_BUTTON"], ["A","A_BUTTON"], ["B","B_BUTTON"]]), "NAME")
            .appendField("is pressed");
        this.setOutput(true, "Boolean");
        this.setColour(10);
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
        this.setColour(267);
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
        this.setColour(267);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

  Blockly.Blocks['beginblock'] = {  //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#sxxy4y
      init: function() {
        this.appendDummyInput()
            .appendField("When Game Begins");
        this.setNextStatement(true, null);
        this.setColour(10);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['collisionwithany'] = {  //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vjt3o8
      init: function() {
        this.appendDummyInput()
            .appendField("When collides with anything");
        this.setNextStatement(true, null);
        this.setColour(267);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['incrementx'] = {    //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#mfzt59
      init: function() {
        this.appendValueInput("incrementAmount")
            .setCheck("Number")
            .appendField("Increment X by");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(267);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['incrementy'] = {    //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#mfzt59
      init: function() {
        this.appendValueInput("incrementAmount")
            .setCheck("Number")
            .appendField("Increment Y by");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(267);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['is_colliding_with'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Is colliding with")
            .appendField(new Blockly.FieldDropdown(
              this.generateOptions), 'OBJECTNAME');
        this.setOutput(true, "Boolean");
        this.setColour(267);
     this.setTooltip("");
     this.setHelpUrl("");
      },
      generateOptions: function() {
        var options = [];
        var tabnames = window.currentProject.files.map(p => p.name);
        for(i = 0; i < tabnames.length; i++){
          options.push([tabnames[i], "allObjects[" + i + "]"]);
        }
        options.push(["Wassap", "allObjects[" + i + "]"]);

        if(options.length == 0){
          return options.push(['mem','MEMES']);
        }

        return options;
      }
      
    };

    Blockly.Blocks['gamestart'] = {
      init: function() {
        this.appendStatementInput("NAME")
            .setCheck(null)
            .appendField("When game starts");
        this.setColour(10);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['playnotes3'] = {   //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wgxxin
      init: function() {
        this.appendValueInput("First")
            .setCheck("Note")
            .appendField("Play Notes");
        this.appendValueInput("Second")
            .setCheck("Note");
        this.appendValueInput("Third")
            .setCheck("Note");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(168);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['playnotes2'] = {   //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wgxxin
      init: function() {
        this.appendValueInput("First")
            .setCheck("Note")
            .appendField("Play Notes");
        this.appendValueInput("Second")
            .setCheck("Note");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(168);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['playnote'] = {   //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wgxxin
      init: function() {
        this.appendValueInput("First")
            .setCheck("Note")
            .appendField("Play Note");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(168);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    //https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#q9tve5
    Blockly.Blocks['note'] = {
      init: function() {
        this.appendValueInput("Note")
            .setCheck("Number")
            .appendField("Note")
            .appendField(new Blockly.FieldDropdown([["a","A"], ["b","B"], ["c","C"], ["d","D"], ["e","E"], ["f","F"], ["g","G"]]), "note")
            .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"], ["7","7"]]), "octive")
            .appendField("For a duration of (ms)");
        this.setOutput(true, "Note");
        this.setColour(168);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['wait'] = {
      init: function() {
        this.appendValueInput("Milis")
            .setCheck("Number")
            .appendField("Wait For (ms)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(10);
     this.setTooltip("");
     this.setHelpUrl("");
      }
    };
    

    

    

    







}