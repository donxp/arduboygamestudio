/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the logic blocks.
 */
'use strict';

goog.provide('Blockly.Arduino.logic');

goog.require('Blockly.Arduino');


/**
 * Code generator to create if/if else/else statement.
 * Arduino code: loop { if (X)/else if ()/else { X } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['controls_if'] = function(block) {
  var n = 0;
  var argument = Blockly.Arduino.valueToCode(block, 'IF' + n,
      Blockly.Arduino.ORDER_NONE) || 'false';
  var branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Arduino.valueToCode(block, 'IF' + n,
        Blockly.Arduino.ORDER_NONE) || 'false';
    branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.Arduino.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

/**
 * Code generator for the comparison operator block.
 * Arduino code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['logic_compare'] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Arduino.ORDER_EQUALITY : Blockly.Arduino.ORDER_RELATIONAL;
  var argument0 = Blockly.Arduino.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Arduino.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

/**
 * Code generator for the logic operator block.
 * Arduino code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['logic_operation'] = function(block) {
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Arduino.ORDER_LOGICAL_AND :
      Blockly.Arduino.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Arduino.valueToCode(block, 'A', order) || 'false';
  var argument1 = Blockly.Arduino.valueToCode(block, 'B', order) || 'false';
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

/**
 * Code generator for the logic negate operator.
 * Arduino code: loop { !X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['logic_negate'] = function(block) {
  var order = Blockly.Arduino.ORDER_UNARY_PREFIX;
  var argument0 = Blockly.Arduino.valueToCode(block, 'BOOL', order) || 'false';
  var code = '!' + argument0;
  return [code, order];
};

/**
 * Code generator for the boolean values true and false.
 * Arduino code: loop { true/false }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['logic_boolean'] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for the null value.
 * Arduino code: loop { X ? Y : Z }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['logic_null'] = function(block) {
  var code = 'NULL';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for the ternary operator.
 * Arduino code: loop { NULL }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 *
 * TODO: Check types of THEN and ELSE blocks and add warning to this block if
 *       they are different from each other.
 */
Blockly.Arduino['logic_ternary'] = function(block) {
  var valueIf = Blockly.Arduino.valueToCode(block, 'IF',
      Blockly.Arduino.ORDER_CONDITIONAL) || 'false';
  var valueThen = Blockly.Arduino.valueToCode(block, 'THEN',
      Blockly.Arduino.ORDER_CONDITIONAL) || 'null';
  var valueElse = Blockly.Arduino.valueToCode(block, 'ELSE',
      Blockly.Arduino.ORDER_CONDITIONAL) || 'null';
  var code = valueIf + ' ? ' + valueThen + ' : ' + valueElse;
  return [code, Blockly.Arduino.ORDER_CONDITIONAL];
};

//Custom blocks begin below here

Blockly.Arduino['checkforbuttonpress'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = 'arduboy.pressed('+ dropdown_name +')';          //takes the dropdown string and puts it in the method parameters example return will look like 'arduboy.pressed(UP_BUTTON)'
  return [code, Blockly.Arduino.ORDER_EQUALITY];
};


Blockly.Arduino['incrementx'] = function(block) {
  var value_incrementamount = Blockly.Arduino.valueToCode(block, 'incrementAmount', Blockly.Arduino.ORDER_ATOMIC);
  
  if(value_incrementamount == ""){
    value_incrementamount = 0;
  }
  var code = 'changeXByAmount(' + value_incrementamount +');\n';
  return code;
};


Blockly.Arduino['incrementy'] = function(block) {
  var value_incrementamount = Blockly.Arduino.valueToCode(block, 'incrementAmount', Blockly.Arduino.ORDER_ATOMIC);
 
  if(value_incrementamount == ""){
    value_incrementamount = 0;
  }
  var code = 'changeYByAmount(' + value_incrementamount +');\n';
  return code;
};



Blockly.Arduino['is_colliding_with'] = function(block) {
  var dropdown_objectname = block.getFieldValue('OBJECTNAME');
  
  var code = 'checkForCollision(' + dropdown_objectname + ')';

  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['gamestart'] = function(block) {
  var statements_name = Blockly.Arduino.statementToCode(block, 'NAME');
  
  var code = 'if(initial){\ninitial = false;\n'+ statements_name +'\n};\n';
  return code;
};


Blockly.Arduino['changexpos'] = function(block) {
  var value_newxpos = Blockly.Arduino.valueToCode(block, 'newxpos', Blockly.Arduino.ORDER_ATOMIC);
  
  if(value_newxpos == ""){
    value_newxpos = 0;
  }
  var code = 'changeXpos('+value_newxpos + ');\n';
  return code;
};

Blockly.Arduino['changeypos'] = function(block) {
  var value_newypos = Blockly.Arduino.valueToCode(block, 'newypos', Blockly.Arduino.ORDER_ATOMIC);
  
  if(value_newypos == ""){
    value_newypos = 0;
  }
  var code = 'changeYpos('+value_newypos + ');\n';
  return code;
};

Blockly.Arduino['playnotes3'] = function(block) {
  var value_first = Blockly.Arduino.valueToCode(block, 'First', Blockly.Arduino.ORDER_ATOMIC);
  var value_second = Blockly.Arduino.valueToCode(block, 'Second', Blockly.Arduino.ORDER_ATOMIC);
  var value_third = Blockly.Arduino.valueToCode(block, 'Third', Blockly.Arduino.ORDER_ATOMIC);
  
  if(value_first == ""){
    value_first = "1000,100";
  }
  if(value_second == ""){
    value_second = "1000,100";
  }
  if(value_third == ""){
    value_third = "1000,100";
  }

  var code = 'sound.tone('+ value_first + ',' + value_second + ',' + value_third + ');\n';


  return  code ;
};

Blockly.Arduino['note'] = function(block) {
  var dropdown_note = block.getFieldValue('note');
  var dropdown_octive = block.getFieldValue('octive');
  var value_note = Blockly.Arduino.valueToCode(block, 'Note', Blockly.Arduino.ORDER_ATOMIC);
  
  if(value_note == ""){
    value_note = 100;
  }
  var code = 'NOTE_' + dropdown_note + dropdown_octive + ',' + value_note;
 
 
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['playnotes2'] = function(block) {
  var value_first = Blockly.Arduino.valueToCode(block, 'First', Blockly.Arduino.ORDER_ATOMIC);
  var value_second = Blockly.Arduino.valueToCode(block, 'Second', Blockly.Arduino.ORDER_ATOMIC);
  if(value_first == ""){
    value_first = "1000,100";
  }
  if(value_second == ""){
    value_second = "1000,100";
  }
  
  var code = 'sound.tone('+ value_first + ',' + value_second + ');\n';

  return code;
};

Blockly.Arduino['playnote'] = function(block) {
  var value_first = Blockly.Arduino.valueToCode(block, 'First', Blockly.Arduino.ORDER_ATOMIC);
 
  if(value_first == ""){
    value_first = "1000,100";
  }
  var code = 'sound.tone('+ value_first +');\n';

  return code;
};

Blockly.Arduino['wait'] = function(block) {
  var value_milis = Blockly.Arduino.valueToCode(block, 'Milis', Blockly.Arduino.ORDER_ATOMIC);
  
  if(value_milis == ""){
    value_milis = 0;
  }
  var code = 'wait('+ value_milis +');\n';
  return code;
};

Blockly.Arduino['xpos'] = function(block) {
  
  var code = 'xPos';                                //xPos is a variable in game wrapper
  
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['ypos'] = function(block) {
  
  var code = 'yPos';                                //yPos is a variable in game wrapper
  
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['screenheight'] = function(block) {
  
  var code = 'arduboy.height()';                        //a method from the arduboy library
  
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['screenwidth'] = function(block) {
  
  var code = 'arduboy.width()';                         //a method from the arduboy library
  
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['setsprite'] = function(block) {
  var dropdown_objectname = block.getFieldValue('OBJECTNAME');
  
  var code = 'setSprite(' + dropdown_objectname + ');\n';                       //takes the sprite dimensions
  
  return code;
};

Blockly.Arduino['printat'] = function(block) {
  var value_display_text = Blockly.Arduino.valueToCode(block, 'Display Text', Blockly.Arduino.ORDER_ATOMIC);
  var value_at_x = Blockly.Arduino.valueToCode(block, 'at X', Blockly.Arduino.ORDER_ATOMIC);
  var value_at_y = Blockly.Arduino.valueToCode(block, 'at Y', Blockly.Arduino.ORDER_ATOMIC);
  
  var code = 'tinyfont.setCursor('+value_at_x+', '+value_at_y+');\n tinyfont.print('+ value_display_text+');';  //this generates 2 lines as the cursor needs to be set and then print is called
  return code;
};

Blockly.Arduino['changexposof'] = function(block) {
  var dropdown_objectname = block.getFieldValue('OBJECTNAME');
  var value_newxpos = Blockly.Arduino.valueToCode(block, 'newxpos', Blockly.Arduino.ORDER_ATOMIC);
  
  var code = dropdown_objectname  + "->changeXpos(" + value_newxpos + ");";             //Example result would be allObjects[1]->changeXPos()
  
  return code;
};

Blockly.Arduino['changeyposof'] = function(block) {
  var dropdown_objectname = block.getFieldValue('OBJECTNAME');
  var value_newypos = Blockly.Arduino.valueToCode(block, 'newypos', Blockly.Arduino.ORDER_ATOMIC);
  
  var code = dropdown_objectname  + "->changeYpos(" + value_newypos + ");";             //Example result would be allObjects[1]->changeYPos()
  
  return code;
};

Blockly.Arduino['randomrange'] = function(block) {
  var value_min = Blockly.Arduino.valueToCode(block, 'min', Blockly.Arduino.ORDER_ATOMIC);
  var value_max = Blockly.Arduino.valueToCode(block, 'max', Blockly.Arduino.ORDER_ATOMIC);
  if(value_min == ""){
    value_min = 0;
  }
  if(value_max == ""){
    value_max = 0;
  }
  var code = 'randomRange(' + value_min + ',' + value_max + ')';
  return [code, Blockly.Arduino.ORDER_NONE];
};



