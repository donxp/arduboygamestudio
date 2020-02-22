

let ProjectManager = require('./app/util/ProjectManager.js')

/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */


/**
 * Based on work of Fred Lin (gasolin@gmail.com) for Blocklyduino.
 *
 * @fileoverview Helper functions for generating Arduino language (C++).
 */
'use strict';

goog.provide('Blockly.Arduino');

goog.require('Blockly.Generator');


/**
 * Arduino code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Arduino = new Blockly.Generator('Arduino');
Blockly.Arduino.StaticTyping = new Blockly.StaticTyping();

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * Arduino specific keywords defined in: http://arduino.cc/en/Reference/HomePage
 * @private
 */
Blockly.Arduino.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
    'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
    'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
    'float,double,string,String,array,static,volatile,const,sizeof,pinMode,' +
    'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
    'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
    'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
    'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
    'detachInterrupt,interrupts,noInterrupts');

/** Order of operation ENUMs. */
Blockly.Arduino.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Arduino.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
Blockly.Arduino.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Arduino.ORDER_ADDITIVE = 4;       // + -
Blockly.Arduino.ORDER_SHIFT = 5;          // << >>
Blockly.Arduino.ORDER_RELATIONAL = 6;     // >= > <= <
Blockly.Arduino.ORDER_EQUALITY = 7;       // == != === !==
Blockly.Arduino.ORDER_BITWISE_AND = 8;    // &
Blockly.Arduino.ORDER_BITWISE_XOR = 9;    // ^
Blockly.Arduino.ORDER_BITWISE_OR = 10;    // |
Blockly.Arduino.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Arduino.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Arduino.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
Blockly.Arduino.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Arduino.ORDER_NONE = 99;          // (...)

/**
 * A list of types tasks that the pins can be assigned. Used to track usage and
 * warn if the same pin has been assigned to more than one task.
 */
Blockly.Arduino.PinTypes = {
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
  PWM: 'PWM',
  SERVO: 'SERVO',
  STEPPER: 'STEPPER',
  SERIAL: 'SERIAL',
  I2C: 'I2C/TWI',
  SPI: 'SPI'
};

/**
 * Arduino generator short name for
 * Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_
 * @type {!string}
 */
Blockly.Arduino.DEF_FUNC_NAME = Blockly.Arduino.FUNCTION_NAME_PLACEHOLDER_;

/**
 * Initialises the database of global definitions, the setup function, function
 * names, and variable names.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Arduino.init = function(workspace) {
  // Create a dictionary of definitions to be printed at the top of the sketch
  Blockly.Arduino.includes_ = Object.create(null);
  // Create a dictionary of global definitions to be printed after variables
  Blockly.Arduino.definitions_ = Object.create(null);
  // Create a dictionary of variables
  Blockly.Arduino.variables_ = Object.create(null);
  // Create a dictionary of functions from the code generator
  Blockly.Arduino.codeFunctions_ = Object.create(null);
  // Create a dictionary of functions created by the user
  Blockly.Arduino.userFunctions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions)
  Blockly.Arduino.functionNames_ = Object.create(null);
  // Create a dictionary of setups to be printed in the setup() function
  Blockly.Arduino.setups_ = Object.create(null);
  // Create a dictionary of pins to check if their use conflicts
  Blockly.Arduino.pins_ = Object.create(null);

  if (!Blockly.Arduino.variableDB_) {
    Blockly.Arduino.variableDB_ =
        new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
  } else {
    Blockly.Arduino.variableDB_.reset();
  }
  Blockly.Arduino.variableDB_.setVariableMap(workspace.getVariableMap())
  // Iterate through to capture all blocks types and set the function arguments
  // var varsWithTypes = Blockly.Variables.allUsedVarModels(workspace);
  var varsWithTypes = Blockly.Arduino.StaticTyping.collectVarsWithTypes(workspace);
  Blockly.Arduino.StaticTyping.setProcedureArgs(workspace, varsWithTypes);

  // Set variable declarations with their Arduino type in the defines dictionary
  for (var varName in varsWithTypes) {
    Blockly.Arduino.addVariable(varName,
        Blockly.Arduino.getArduinoType_(varsWithTypes[varName]) +' ' +
        Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ';');
  }
};

/**
 * Prepare all generated code to be placed in the sketch specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed sketch code.
 */
Blockly.Arduino.finish = function(code) {
  // Convert the includes, definitions, and functions dictionaries into lists
  var includes = [], definitions = [], variables = [], functions = [];
  for (var name in Blockly.Arduino.includes_) {
    includes.push(Blockly.Arduino.includes_[name]);
  }
  if (includes.length) {
    includes.push('\n');
  }
  for (var name in Blockly.Arduino.variables_) {
    variables.push(Blockly.Arduino.variables_[name]);
  }
  if (variables.length) {
    variables.push('\n');
  }
  for (var name in Blockly.Arduino.definitions_) {
    definitions.push(Blockly.Arduino.definitions_[name]);
  }
  if (definitions.length) {
    definitions.push('\n');
  }
  for (var name in Blockly.Arduino.codeFunctions_) {
    functions.push(Blockly.Arduino.codeFunctions_[name]);
  }
  for (var name in Blockly.Arduino.userFunctions_) {
    functions.push(Blockly.Arduino.userFunctions_[name]);
  }
  if (functions.length) {
    functions.push('\n');
  }

  // userSetupCode added at the end of the setup function without leading spaces
  var setups = [''], userSetupCode= '';
  if (Blockly.Arduino.setups_['userSetupCode'] !== undefined) {
    userSetupCode = '\n' + Blockly.Arduino.setups_['userSetupCode'];
    delete Blockly.Arduino.setups_['userSetupCode'];
  }
  for (var name in Blockly.Arduino.setups_) {
    setups.push(Blockly.Arduino.setups_[name]);
  }
  if (userSetupCode) {
    setups.push(userSetupCode);
  }

  // Clean up temporary data
  delete Blockly.Arduino.includes_;
  delete Blockly.Arduino.definitions_;
  delete Blockly.Arduino.codeFunctions_;
  delete Blockly.Arduino.userFunctions_;
  delete Blockly.Arduino.functionNames_;
  delete Blockly.Arduino.setups_;
  delete Blockly.Arduino.pins_;
  Blockly.Arduino.variableDB_.reset();

  var allDefs = includes.join('\n') + variables.join('\n') +
      definitions.join('\n') + functions.join('\n\n');
  var setup = 'void setup() {' + setups.join('\n  ') + '\n}\n\n';
  var loop = 'void loop() {\n  ' + code.replace(/\n/g, '\n  ') + '\n}';

  var codeToShow = variables.join('\n') + "//seperator\n" + code.replace(/\n/g, '\n  ');

 

 // return allDefs + setup + loop;
 //return Blockly.Arduino.generateAllCode();
 
 //Blockly.Arduino.showMeTheMoney();
 return codeToShow;
 //console.log("MAN LOOK AT THIS!!!!!!!!!!!!!");
 //console.log(ProjectManager.generateSpriteArray());
 //return generateSpriteArrays() + generateClass("name",codeToShow);
};


Blockly.Arduino.showMeTheCode = function showMe(){
  document.getElementById("theP").innerHTML = Blockly.Arduino.generateAllCode();
}

Blockly.Arduino.generateAllCode = function generateAllCode1(){
    var fullCode = includes + generateSpriteArrays() +
                   outOfClassMethods +
                   gameobjectClass +
                   generateArrayDeclaration() +
                   generateSubclasses() +
                   setupVoid + 
                   generateGameObjectCreation() + 
                   loopVoid;

                   

  return fullCode;
}

var includes = '#include <Arduboy2.h>\n' +
'Arduboy2 arduboy;\n' +
'#define ARDBITMAP_SBUF arduboy.getBuffer()\n' +
'#include <ArdBitmap.h>\n' +
'#include <ArduboyTones.h>\n' +
'ArduboyTones sound(arduboy.audio.enabled);\n';

function generateSpriteArrays(){
  var spriteArrays = "";
  var spriteAmount = window.currentProject.sprites.length
  for(i = 0; i < spriteAmount; i++){
    thisSpriteArray = 'const unsigned char SPRITENUMBER' + i + ' [] PROGMEM = {\n' + 
    ProjectManager.generateSpriteArray()[i].code + ',};\n'
    spriteArrays = spriteArrays + thisSpriteArray;
  }
  
  var arrayWithNames = "const unsigned char *spriteArray[] = {";
  for(i = 0; i < spriteAmount; i++){
    arrayWithNames = arrayWithNames + "\nSPRITENUMBER" + i + ","; 
  }
  
  arrayWithNames = arrayWithNames + "\n};\n"



  return spriteArrays + "\n" + arrayWithNames;
}

var outOfClassMethods = 'int randomRange(int lower, int upper){\n' + 
                        'return (rand() % (upper - lower)) + lower;' +
                        '}\n' +
                        '\n'  +
                        'void wait(int milis){\n'  +
                        'delay(milis);\n'  +
                        '}\n'  +
                        '\n';
  

var gameobjectClass = 'class GameObject {\n' + 
                      'public:\n'+
                      'int xPos;\n'+         
                      'int yPos;\n'+         
                      'int spriteIndex;\n'+         
                      'int spriteHeight = 8, spriteWidth = 8;\n'+         
                      'bool initial = true;\n'+
                      'int instanceNumber;\n'+ 
                      'Rect mainRect;\n'+         
                      'GameObject(){}\n'+         
                      ' GameObject(int x,int y,int mySpriteIndex,int sprH,int sprW,int instNumber){\n'+         
                      'xPos = x;\n'+         
                      'yPos = y;\n'+
                      'instanceNumber = instNumber;\n' + 
                      'spriteIndex = mySpriteIndex;\n'+         
                      'spriteWidth = sprW;\n'+         
                      'spriteHeight = sprH;\n'+         
                      'mainRect.x = xPos;\n'+         
                      'mainRect.y = yPos;\n'+         
                      'mainRect.width = spriteWidth;\n'+         
                      'mainRect.height = spriteHeight;\n'+         
                      'changePos(x,y);\n'+         
                      'drawSprite();\n'+         
                      '}\n'+         
                      'boolean checkForCollision(GameObject* other){\n'+         
                      'if (arduboy.collide(mainRect, other->getRect())) {\n'+         
                      'return true;\n'+
                      ' }else{\n'+
                      'return false;\n'+   
                      '}\n'+   
                      '}\n'+   
                      '\n'+   
                      'void goToRandomPos(){\n'+   
                      'changePos(randomRange(0,WIDTH),randomRange(0,HEIGHT));\n'+   
                      '}\n'+   
                      'Rect getRect(){\n'+   
                      ' return mainRect;\n'+   
                      '}\n'+   
                      ' int getSpriteHeight(){\n'+   
                      'return spriteHeight;\n'+   
                      '}\n'+  
                      ' int getSpriteWidth(){\n'+  
                      'return spriteWidth;\n'+  
                      '}\n'+    
                      'void changePos(int newX, int newY) {\n'+  
                      'xPos = newX;\n'+  
                      'yPos = newY;\n'+  
                      'mainRect.x = xPos;\n'+  
                      'mainRect.y = yPos;\n'+  
                      '}\n'+  
                      'void changeXByAmount(int incrementAmount) {  \n'+  
                      'xPos = xPos + incrementAmount;\n'+  
                      'mainRect.x = xPos;\n'+
                      '}\n'+    
                      ' void changeYByAmount(int incrementAmount) {\n'+  
                      'yPos = yPos + incrementAmount;\n'+  
                      'mainRect.y = yPos;\n'+  
                      '}\n'+
                      'void changeXpos(int newX) {\n' +
                        'xPos = newX;\n' +
                        'mainRect.x = newX;\n' +
                        '}\n' +
                        'void changeYpos(int newY) {\n' +
                        'yPos = newY;\n' +
                        'mainRect.y = newY;\n' +
                        '}\n' +
                      'void setSprite(int spriteInd,int spriteH,int spriteW){\n' +
                      'spriteIndex = spriteInd;\n' +
                      'spriteHeight = spriteH;\n' +
                      'spriteWidth = spriteW;\n' + 
                      '}\n' +
                      'virtual void mainFunction(){\n'+  
                      '\n'+  
                      '}\n'+
                      'void drawSprite(){\n'+  
                      'arduboy.drawBitmap(xPos, yPos, spriteArray[spriteIndex],spriteWidth,spriteHeight,1);\n'+  
                      '}\n'+ 
                      '};\n';

function generateArrayDeclaration(){
    var myString = 'const int arraySize = ' + getAmountOfObjects() + ';\n' +
    'GameObject *allObjects[arraySize];\n';

    return myString;
}
//returns the amount of objects for all tabs combined
function getAmountOfObjects(){
  return window.currentProject.files.length;
}
//returns the amount of tabs
function getAmountOfTabs(){
  return window.currentProject.files.length;
}


function generateSubclasses(){
    var myString = '';
    for(var i = 0; i < getAmountOfTabs(); i++){
        myString =  myString + generateClass("mySubClass" + i,getTabCodeByNumber(i));
    }

    return myString;
}

var sampleCode1 = 'if(initial){\n' +
                'initial = false;\n' +
                'changeXpos(30);\n' +
                'changeYpos(30);\n' +
                '};\n' +
            'if (checkForCollision(allObjects[1])) {\n' +
            'changeXByAmount(10);\n' +
                '}\n';

var sampleCode2 = 'if(initial){\n' +
'initial = false;\n' +
'changeXpos(50);\n' +
'changeYpos(30);\n' +
'};\n' +
'\n' +
'  if (arduboy.pressed(LEFT_BUTTON)) {\n' +
'changeXByAmount(-1);\n' +
'}\n' +
' if (arduboy.pressed(RIGHT_BUTTON)) {\n' +
'changeXByAmount(1);\n' +
'}\n';

//getTabCodeByIndex(2) would return the second tab's code
function getTabCodeByNumber(tabNumber){
  const tabObj = window.currentProject.files[tabNumber];
  ProjectManager.switchToTab(tabObj.name);
  
  return Blockly.Arduino.workspaceToCode(window.workspace);
  
}

function generateClass(name,code) {
  var newGameObjectCode = '\nclass ' + name + ' : public GameObject {\n' +
                          'public:\n' +
                          name + '(){}\n' +
                          name + '(int x, int y, int spr,int sprH,int sprW,int inst):\n' +
                          'GameObject(x,y,spr,sprH,sprW,inst){\n' +
                          'arduboy.print("");\n' +
                          '}\n' +
                          isolateVariables(code) + '\n' + 
                          'void mainFunction() override {\n' +
                          'drawSprite();\n' +
                          isolateCode(code) + '\n' +
                          '}\n' +
                         
                          '\n' +
                          '};\n';
  return newGameObjectCode;   
}

function isolateVariables(code){
  for (var i = 0; i < code.length; i++) {
    if(code.charAt(i) == '/'){
      if(code.charAt(i + 1) == '/'){
        if(code.charAt(i + 2) == 's'){
          return code.slice(0, i);
      }
    }
  }
  }
}

function isolateCode(code){
  for (var i = 0; i < code.length; i++) {
    if(code.charAt(i) == '/'){
      if(code.charAt(i + 1) == '/'){
        if(code.charAt(i + 2) == 's'){
          return code.slice(i, code.length);
      }
    }
  }
  }
}

var setupVoid = 'void setup() {\n' +
  'arduboy.begin();\n' +
  'arduboy.setFrameRate(20);\n' +
  'arduboy.initRandomSeed();\n' +
  'gameObjectCreation();\n}\n\n';


function generateGameObjectCreation(){
    var theString = 'void gameObjectCreation(){\n';
    var counter = 0;
    for(var i = 0; i < getAmountOfTabs();i++){
      for(var u = 0; u < getAmountOfObjectsInTab(i); u++){
        theString = theString + 'mySubClass' + i + ' objName' + i + '_' + u + '(0,0,' + getSpriteIndexAndDimensionsForTab(i) + ',' + (getAmountOfObjectsInTab(i) - u) + ');\n';
        theString = theString + 'allObjects['+ counter +'] = &objName' + i + '_' + u + ';\n' 
        counter = counter + 1;
      }
    }

    return theString + '}\n';
}

function getAmountOfObjectsInTab(tabNumber){
  return 1; 
}

function getSpriteIndexAndDimensionsForTab(tabNumber){
  return '0,0,0';   //spriteNumber, sprite height, sprite width
}

var loopVoid = 'void loop() {\n'+
      'if (!(arduboy.nextFrame())){\n'+
      'return;\n'+
      '}\n'+
      'arduboy.clear(); //clears the screen\n'+
      'for (int i = 0; i < arraySize; i++){ \n'+
      'allObjects[i]->mainFunction();\n'+
      '}\n'+
      'arduboy.display();\n'+
      '}\n';










/**
 * Adds a string of "include" code to be added to the sketch.
 * Once a include is added it will not get overwritten with new code.
 * @param {!string} includeTag Identifier for this include code.
 * @param {!string} code Code to be included at the very top of the sketch.
 */
Blockly.Arduino.addInclude = function(includeTag, code) {
  if (Blockly.Arduino.includes_[includeTag] === undefined) {
    Blockly.Arduino.includes_[includeTag] = code;
  }
};

/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.Arduino.addDeclaration = function(declarationTag, code) {
  if (Blockly.Arduino.definitions_[declarationTag] === undefined) {
    Blockly.Arduino.definitions_[declarationTag] = code;
  }
};

/**
 * Adds a string of code to declare a variable globally to the sketch.
 * Only if overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} varName The name of the variable to declare.
 * @param {!string} code Code to be added for the declaration.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the declaration overwrote a previous one.
 */
Blockly.Arduino.addVariable = function(varName, code, overwrite) {
  var overwritten = false;
  if (overwrite || (Blockly.Arduino.variables_[varName] === undefined)) {
    Blockly.Arduino.variables_[varName] = code;
    overwritten = true;
  }
  return overwritten;
};

/**
 * Adds a string of code into the Arduino setup() function. It takes an
 * identifier to not repeat the same kind of initialisation code from several
 * blocks. If overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} setupTag Identifier for the type of set up code.
 * @param {!string} code Code to be included in the setup() function.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the new setup code overwrote a previous one.
 */
Blockly.Arduino.addSetup = function(setupTag, code, overwrite) {
  var overwritten = false;
  if (overwrite || (Blockly.Arduino.setups_[setupTag] === undefined)) {
    Blockly.Arduino.setups_[setupTag] = code;
    overwritten = true;
  }
  return overwritten;
};

/**
 * Adds a string of code as a function. It takes an identifier (meant to be the
 * function name) to only keep a single copy even if multiple blocks might
 * request this function to be created.
 * A function (and its code) will only be added on first request.
 * @param {!string} preferedName Identifier for the function.
 * @param {!string} code Code to be included in the setup() function.
 * @return {!string} A unique function name based on input name.
 */
Blockly.Arduino.addFunction = function(preferedName, code) {
  if (Blockly.Arduino.codeFunctions_[preferedName] === undefined) {
    var uniqueName = Blockly.Arduino.variableDB_.getDistinctName(
        preferedName, Blockly.Generator.NAME_TYPE);
    Blockly.Arduino.codeFunctions_[preferedName] =
        code.replace(Blockly.Arduino.DEF_FUNC_NAME, uniqueName);
    Blockly.Arduino.functionNames_[preferedName] = uniqueName;
  }
  return Blockly.Arduino.functionNames_[preferedName];
};

/**
 * Description.
 * @param {!Blockly.Block} block Description.
 * @param {!string} pin Description.
 * @param {!string} pinType Description.
 * @param {!string} warningTag Description.
 */
Blockly.Arduino.reservePin = function(block, pin, pinType, warningTag) {
  if (Blockly.Arduino.pins_[pin] !== undefined) {
    if (Blockly.Arduino.pins_[pin] != pinType) {
      block.setWarningText(Blockly.Msg.ARD_PIN_WARN1.replace('%1', pin)
		.replace('%2', warningTag).replace('%3', pinType)
		.replace('%4', Blockly.Arduino.pins_[pin]), warningTag);
    } else {
      block.setWarningText(null, warningTag);
    }
  } else {
    Blockly.Arduino.pins_[pin] = pinType;
    block.setWarningText(null, warningTag);
  }
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Arduino.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly.Arduino.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Arduino.scrub_ = function(block, code) {
  if (code === null) { return ''; } // Block has handled code generation itself

  var commentCode = '';
  // Only collect comments for blocks that aren't inline
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments
    // Don't collect comments for nested statements
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Generates Arduino Types from a Blockly Type.
 * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
 * @return {string} Arduino type for the respective Blockly input type, in a
 *     string format.
 * @private
 */
Blockly.Arduino.getArduinoType_ = function(typeBlockly) {
  switch (typeBlockly.typeId) {
    case Blockly.Types.SHORT_NUMBER.typeId:
      return 'char';
    case Blockly.Types.NUMBER.typeId:
      return 'int';
    case Blockly.Types.LARGE_NUMBER.typeId:
      return 'long';
    case Blockly.Types.DECIMAL.typeId:
      return 'float';
    case Blockly.Types.TEXT.typeId:
      return 'String';
    case Blockly.Types.CHARACTER.typeId:
      return 'char';
    case Blockly.Types.BOOLEAN.typeId:
      return 'boolean';
    case Blockly.Types.NULL.typeId:
      return 'void';
    case Blockly.Types.UNDEF.typeId:
      return 'undefined';
    case Blockly.Types.CHILD_BLOCK_MISSING.typeId:
      // If no block connected default to int, change for easier debugging
      //return 'ChildBlockMissing';
      return 'int';
    default:
      return 'Invalid Blockly Type';
    }
};

/** Used for not-yet-implemented block code generators */
Blockly.Arduino.noGeneratorCodeInline = function() {
  return ['', Blockly.Arduino.ORDER_ATOMIC];
};

/** Used for not-yet-implemented block code generators */
Blockly.Arduino.noGeneratorCodeLine = function() { return ''; };
