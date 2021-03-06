let ProjectManager = require('./util/ProjectManager.js')

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

  blocks['math_number'] = {
    init: function() {
      this.jsonInit({
        type: "math_number",
        message0: "%1",
        args0: [{
            type: "field_number",
            name: "NUM",
            value: 0
        }],
        output: "Number",
        helpUrl: "%{BKY_MATH_NUMBER_HELPURL}",
        tooltip: "%{BKY_MATH_NUMBER_TOOLTIP}",
        extensions: ["parent_tooltip_when_inline"],
        colour: 137
      })
    }
  }

  blocks['math_arithmetic'] = {
    init: function() {
      this.jsonInit({
        type: "math_arithmetic",
        message0: "%1 %2 %3",
        args0: [{
            type: "input_value",
            name: "A",
            check: "Number"
        }, {
            type: "field_dropdown",
            name: "OP",
            options: [
                ["%{BKY_MATH_ADDITION_SYMBOL}", "ADD"],
                ["%{BKY_MATH_SUBTRACTION_SYMBOL}", "MINUS"],
                ["%{BKY_MATH_MULTIPLICATION_SYMBOL}",
                    "MULTIPLY"
                ],
                ["%{BKY_MATH_DIVISION_SYMBOL}", "DIVIDE"],
                ["%{BKY_MATH_POWER_SYMBOL}", "POWER"]
            ]
        }, {
            type: "input_value",
            name: "B",
            check: "Number"
        }],
        inputsInline: !0,
        output: "Number",
        helpUrl: "%{BKY_MATH_ARITHMETIC_HELPURL}",
        extensions: ["math_op_tooltip"],
        colour: 137
    })
    }
  }

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
        this.setOutput(true, "String");
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

    blocks['controls_repeat_ext'] = {
      init: function() {
        this.jsonInit({
          type: "controls_repeat_ext",
          message0: "%{BKY_CONTROLS_REPEAT_TITLE}",
          args0: [{
              type: "input_value",
              name: "TIMES",
              check: "Number"
          }],
          message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
          args1: [{
              type: "input_statement",
              name: "DO"
          }],
          previousStatement: null,
          nextStatement: null,
          tooltip: "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
          helpUrl: "%{BKY_CONTROLS_REPEAT_HELPURL}",
          colour: 10
      })
      }
    }

    blocks['controls_if'] = {
      init: function() {
        this.jsonInit({
          type: "controls_if",
          message0: "%{BKY_CONTROLS_IF_MSG_IF} %1",
          args0: [{
              type: "input_value",
              name: "IF0",
              check: "Boolean"
          }],
          message1: "%{BKY_CONTROLS_IF_MSG_THEN} %1",
          args1: [{
              type: "input_statement",
              name: "DO0"
          }],
          previousStatement: null,
          nextStatement: null,
          helpUrl: "%{BKY_CONTROLS_IF_HELPURL}",
          mutator: "controls_if_mutator",
          extensions: ["controls_if_tooltip"],
          colour: 10
      })
      }
    }

    blocks['logic_compare'] = {
      init: function() {
        this.jsonInit({
          type: "logic_compare",
          message0: "%1 %2 %3",
          args0: [{
              type: "input_value",
              name: "A"
          }, {
              type: "field_dropdown",
              name: "OP",
              options: [
                  ["=", "EQ"],
                  ["\u2260", "NEQ"],
                  ["\u200f<", "LT"],
                  ["\u200f\u2264", "LTE"],
                  ["\u200f>", "GT"],
                  ["\u200f\u2265", "GTE"]
              ]
          }, {
              type: "input_value",
              name: "B"
          }],
          inputsInline: !0,
          output: "Boolean",
          helpUrl: "%{BKY_LOGIC_COMPARE_HELPURL}",
          extensions: ["logic_compare",
              "logic_op_tooltip"
          ],
          colour: 54
      })
      }
    }

    blocks['variables_set'] = {
      init: function() {
        this.jsonInit({
          type: "variables_set",
          message0: "%{BKY_VARIABLES_SET}",
          args0: [{
              type: "field_variable",
              name: "VAR",
              variable: "%{BKY_VARIABLES_DEFAULT_NAME}"
          }, {
              type: "input_value",
              name: "VALUE"
          }],
          previousStatement: null,
          nextStatement: null,
          tooltip: "%{BKY_VARIABLES_SET_TOOLTIP}",
          helpUrl: "%{BKY_VARIABLES_SET_HELPURL}",
          extensions: ["contextMenu_variableSetterGetter"],
          colour: 317
      })
      }
    }
    //code above is from ardubolockly
    //code added by df227 starts below




    
    Blockly.Blocks['randomrange'] = {                                                     //delcares name of the block
      init: function() {
        this.appendValueInput("min")                                                    //gives the block an input called min
            .setCheck("Number")                                                         //Makes sure input is of the 'number' type
            .appendField("Random Range  min");                                          //displays text on block
        this.appendValueInput("max")                                                    //gives the block a second input called max
            .setCheck("Number")
            .appendField("max");
        this.setInputsInline(true);                                                     //makes it so all the inputs go on the same line
        this.setOutput(true, "Number");                                                 //Makes the output type of randomrange true
        this.setColour(137);                                                            //Changes the colour of the block
     this.setTooltip("Returns a number randomly between the minimum number and the maximum");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['checkforbuttonpress'] = {                                            
      init: function() {
        this.appendDummyInput()
            .appendField("Button")                //Below is how you give a block a dropdown, the first string in the array is what the user reads and the second is the machine name that arduboy uses
            .appendField(new Blockly.FieldDropdown([["up","UP_BUTTON"], ["down","DOWN_BUTTON"], ["left","LEFT_BUTTON"], ["right","RIGHT_BUTTON"], ["A","A_BUTTON"], ["B","B_BUTTON"]]), "NAME")
            .appendField("is pressed");                 
        this.setOutput(true, "Boolean");
        this.setColour(54);
     this.setTooltip("Retruns true if the selected button is being pressed");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['changexpos'] = {  
      init: function() {
        this.appendValueInput("newxpos")
            .setCheck("Number")
            .appendField("Change X position to");
        this.setPreviousStatement(true, null);            //this gives the block a top connector
        this.setNextStatement(true, null);                //this gives the block a bottom connector
        this.setColour(267);
     this.setTooltip("Will change the x position of the current GameObject");
     this.setHelpUrl("");
      }
    };
    Blockly.Blocks['setsprite'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Set Sprite To")
            .appendField(new Blockly.FieldDropdown(       
              this.generateOptions), 'OBJECTNAME');                     //makes a dropdown but calls a function so that the block can have dynamic dropdown options based on user created content
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(267);
     this.setTooltip("Will change the GameObject's sprite (You can create your own sprite in the sprite creator!)");
     this.setHelpUrl("");
      },
      generateOptions: function() {                                                     //function returns an array of sprite names with details             
        var options = [];
        var generatedSprites = ProjectManager.generateSpriteArray()
        for(let i = 0; i < generatedSprites.length; i++){                               //lopps over generated sprites
          var width = generatedSprites[i].width
          var height = generatedSprites[i].height
        
          options.push([generatedSprites[i].name, i + "," + width + "," + height]);             //displays the name of the sprite in the dropdown and associates the sprite details (sprite content, height and width )
        }
        options.push(["invisible", options.length + "," + 0 + "," + 0]);
       

        return options;
      }
      
    };

    Blockly.Blocks['xpos'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("X Position");
        this.setOutput(true, null);
        this.setColour(267);
     this.setTooltip("Returns the current X position");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['ypos'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Y Position");
        this.setOutput(true, null);
        this.setColour(267);
     this.setTooltip("Returns the current Y position");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['screenheight'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Screen Height");
        this.setOutput(true, null);
        this.setColour(10);
     this.setTooltip("Returns the screen's height");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['screenwidth'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Screen Width");
        this.setOutput(true, null);
        this.setColour(10);
     this.setTooltip("Returns the screen's width");
     this.setHelpUrl("");
      }
    };


  Blockly.Blocks['changeypos'] = {  
      init: function() {
        this.appendValueInput("newypos")
            .setCheck("Number")
            .appendField("Change Y position to");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(267);
     this.setTooltip("Will change the x position of the current GameObject");
     this.setHelpUrl("");
      }
    };

  Blockly.Blocks['beginblock'] = {  
      init: function() {
        this.appendDummyInput()
            .appendField("When Game Begins");
        this.setNextStatement(true, null);
        this.setColour(10);
     this.setTooltip("This block will only run on the first frame of the game (Use it to set sprite or set any variables you don't want changed each frame)");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['collisionwithany'] = {  
      init: function() {
        this.appendDummyInput()
            .appendField("When collides with anything");
        this.setNextStatement(true, null);
        this.setColour(267);
     this.setTooltip("Returns true if the current GameObject's sprite is overlapping with the selected GameObjects sprite");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['incrementx'] = {    
      init: function() {
        this.appendValueInput("incrementAmount")
            .setCheck("Number")
            .appendField("Increment X by");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(267);
     this.setTooltip("Will change the X position by the inputed number");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['incrementy'] = {    
      init: function() {
        this.appendValueInput("incrementAmount")
            .setCheck("Number")
            .appendField("Increment Y by");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(267);
     this.setTooltip("Will change the Y position by the inputed number");
     this.setHelpUrl("");
      }
    };

   

    Blockly.Blocks['gamestart'] = {
      init: function() {
        this.appendStatementInput("NAME")
            .setCheck(null)
            .appendField("When game starts");
        this.setColour(10);
     this.setTooltip("This block will only run on the first frame of the game (Use it to set sprite or set any variables you don't want changed each frame)");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['playnotes3'] = {   
      init: function() {
        this.appendValueInput("First")                    //gives the block 3 inputs
            .setCheck("Note")
            .appendField("Play Notes");
        this.appendValueInput("Second")
            .setCheck("Note");
        this.appendValueInput("Third")
            .setCheck("Note");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(168);
     this.setTooltip("Will play notes if noteblocks are added");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['playnotes2'] = {   
      init: function() {
        this.appendValueInput("First")
            .setCheck("Note")
            .appendField("Play Notes");
        this.appendValueInput("Second")
            .setCheck("Note");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(168);
     this.setTooltip("Will play notes if noteblocks are added");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['playnote'] = {  
      init: function() {
        this.appendValueInput("First")
            .setCheck("Note")
            .appendField("Play Note");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(168);
     this.setTooltip("Will play a note if a noteblock is added");
     this.setHelpUrl("");
      }
    };

    
    Blockly.Blocks['note'] = {
      init: function() {
        this.appendValueInput("Note")
            .setCheck("Number")
            .appendField("Note")                                
            .appendField(new Blockly.FieldDropdown([["a","A"], ["b","B"], ["c","C"], ["d","D"], ["e","E"], ["f","F"], ["g","G"]]), "note")
            .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"], ["7","7"]]), "octive")  //gives them reign to play any note
            .appendField("For a duration of (ms)");
        this.setOutput(true, "Note");
        this.setColour(168);
     this.setTooltip("Combine this with the playnote blocks to implement sound ");
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
     this.setTooltip("Stops the game running for a certain amount of time in miliseconds (1000 = 1 second) ");
     this.setHelpUrl("");
      }

      
    };


    Blockly.Blocks['printat'] = {
      init: function() {
        this.appendValueInput("Display Text")
            .setCheck(["String", "Number"])
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldLabelSerializable("Print"), "PRINTTEXT");
        this.appendValueInput("at X")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldLabelSerializable("X pos"), "XPOS");
        this.appendValueInput("at Y")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldLabelSerializable("Y pos"), "YPOS");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(10);
     this.setTooltip("Print a variable or string at a certain position");
     this.setHelpUrl("");
      }
    };

    Blockly.Blocks['is_colliding_with'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Is colliding with")
            .appendField(new Blockly.FieldDropdown(
              this.generateOptions), 'OBJECTNAME');     //dynamic dropdown calling function below
        this.setOutput(true, "Boolean");
        this.setColour(54);
     this.setTooltip("Returns true if the current GameObject's sprite is overlapping with the selected GameObjects sprite");
     this.setHelpUrl("");
      },
      generateOptions: function() {                                             
        var options = [];
        var tabnames = window.currentProject.files.map(p => p.name);
        for(i = 0; i < tabnames.length; i++){                               
          options.push([tabnames[i], "allObjects[" + i + "]"]);       //iterates over tabs and adds the tab name along with how the game wrapper will refrence that object.         
        }
      

        if(options.length == 0){
          return options.push(['filler','FILLER']);
        }

        return options;
      }
      
    };
    
    //used to change the position of a different GameObject
    Blockly.Blocks['changexposof'] = {
      init: function() {
        this.appendValueInput("newxpos")
            .setCheck("Number")
            .appendField("Change X position of")
            .appendField(new Blockly.FieldDropdown(
              this.generateOptions), 'OBJECTNAME')
            .appendField("to");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
     this.setTooltip("Used to change the X position of other GameObjects");
     this.setHelpUrl("");
    },
    generateOptions: function() {                                                     
      var options = [];
      var tabnames = window.currentProject.files.map(p => p.name);
      for(i = 0; i < tabnames.length; i++){
        options.push([tabnames[i], "allObjects[" + i + "]"]);
      }
      //options.push(["Wassap", "allObjects[" + i + "]"]);

      if(options.length == 0){
        return options.push(['mem','MEMES']);
      }

      return options;
    }
    };

    Blockly.Blocks['changeyposof'] = {
      init: function() {
        this.appendValueInput("newypos")
            .setCheck("Number")
            .appendField("Change Y position of")
            .appendField(new Blockly.FieldDropdown(
              this.generateOptions), 'OBJECTNAME')
            .appendField("to");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
     this.setTooltip("Used to change the X position of other GameObjects");
     this.setHelpUrl("");
    },
    generateOptions: function() {
      var options = [];
      var tabnames = window.currentProject.files.map(p => p.name);
      for(i = 0; i < tabnames.length; i++){
        options.push([tabnames[i], "allObjects[" + i + "]"]);
      }
      //options.push(["Wassap", "allObjects[" + i + "]"]);

      if(options.length == 0){
        return options.push(['mem','MEMES']);
      }

      return options;
    }
    };

    

}