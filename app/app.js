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

var blocklyDiv = document.getElementById('blocklyDiv');
var blocklyArea = document.getElementById('blocklyArea');

window.rootPath = __dirname

/**
 * The purpose of this is to make sure the user wants to leave without saving
 */
function confirmLeave() {
    if (workspace.getAllBlocks().length > 0 && windows <= 1) {
        dialog.showMessageBox({ type: 'warning', buttons: ['Save', 'Don\'t Save', 'Cancel'], message: 'Would You Like To Save?' }, i => function (i) {
            if (i == 0) {//Save
                saveProject()
                return true;
            }
            else if (i == 1) {//Don't Save //DELETE AT END
                return true;
            }
            else if (i > 1) { //Cancel
                return false;
            }
        }
        )
    }
    return true;
}

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