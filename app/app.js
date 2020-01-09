var Blockly = require('blockly')
var Dialogs = require('dialogs')()
require('./app/blocks')(Blockly.Blocks)

var blocklyDiv = document.getElementById('blocklyDiv');
var blocklyArea = document.getElementById('blocklyArea');

// var workspace = Blockly.inject('blocklyDiv',
//     {toolbox: document.getElementById('toolbox')});

function newProject() {
	if (workspace.getAllBlocks().length >0){
		if (!confirm("Do You Wish to save?")) {
			workspace.clear()
		} else {
			alert("Not saved")
		}
	} else {
		workspace.clear()
    }
}

// Overwrite default blockly behaviour to support async ui.
Blockly.prompt = (message, b, callback) => {
    Dialogs.prompt(message, ok => {
        callback(ok)
    })
}

function updateCode() {
    var code = Blockly.Arduino.workspaceToCode(workspace)
    document.getElementById('code').value = code
}

// workspace.addChangeListener(updateCode)