var Blockly = require('blockly')
var Dialogs = require('dialogs')()
var { dialog } = require('electron').remote
var FS = require('fs')
var parser = new DOMParser()
var serializer = new XMLSerializer()

var windows = ['main'] //stores all window names, main being the main function
var currentWindow = "main"; //Stores the current tab open
var currentpath = ""; //pathway of save location (NOT recent.ard)

require('./app/blocks')(Blockly.Blocks)
require('./app/blockly/')
const theme = require('./app/blockly/arduboytheme')
Blockly.Themes.Arduboy = theme.init()

var blocklyDiv = document.getElementById('blocklyDiv');
var blocklyArea = document.getElementById('blocklyArea');

window.rootPath = __dirname

// Overwrite default blockly behaviour to support async ui.
Blockly.prompt = (message, b, callback) => {
    Dialogs.prompt(message, ok => {
        callback(ok)
    })
}

function updateCode() {
    if (window.vm && window.vm.debugMode) {
        var code = Blockly.Arduino.workspaceToCode(workspace)
        document.getElementById('code').value = code
    }
}