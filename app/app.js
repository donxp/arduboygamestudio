var Blockly = require('blockly')
var Dialogs = require('dialogs')()

/* Setup generator */
// require('./generators/cpp')

Blockly.Blocks['string_length'] = {
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

var blocklyDiv = document.getElementById('blocklyDiv');
var blocklyArea = document.getElementById('blocklyArea');

var workspace = Blockly.inject(blocklyDiv,
    {toolbox: document.getElementById('toolbox')});

var onresize = function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);
onresize()
Blockly.svgResize(workspace)

// Create new Workspace and remove all old workspace(s)
function newProject() {
	if (workspace.getAllBlocks().length >0){
		if (!confirm("Do You Wish to save?")) {
			workspace.clear()
		} else {
			alert("Aborted.")
		}
	} else {
		workspace.clear()
    }
}
//Save a file
function saveProject()
{
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    alert(xml_text);
}

//Works for Singular Files
//Loads Project into workspace
var loadProject = function(event) {
    var file = event.target;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function() {
        var xml = $(reader.result);
    }
    var xml = Blockly.Xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(xml, workspace)
}

//Load an existing project
//depreciated by tsdh
/**
function loadProject()
{
    document.getElementById('fileChooser').get
    var doc = document.implementation.createDocument(file, 'xml', null)
    var files = doc.getElemmentByTagName('file')
    //Used to load up each tab of project
    for (i= 0; i < files.length; i++) {
        var xml = Blockly.Xml.textToDom(files[i])
        Blockly.Xml.domToWorkspace(xml, workspace)
    }

}
*/

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

workspace.addChangeListener(updateCode)