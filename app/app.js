var Blockly = require('blockly')
var Dialogs = require('dialogs')()
var {dialog} = require('electron').remote
var FS = require('fs')
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
var currentpath = "";
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
            alert("cancelled!")
		} else {
            saveProject()
            workspace.clear()
            currentpath = "";
        }
	} else {
        workspace.clear()
        currentpath = "";
    }
}

//Update - Use Electron to access the File System
//Save a file
/** DEPRECATED by tsdh2
function saveProject()
{

    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    alert(xml_text);
    var xmlDoc = document.implementation.createDocument(null, "project");
    var node = xmlDoc.createElement("file");
    node.innerHTML = xml_text;
    FS.writeFile(filename,node);
}
*/

//Works for Singular Files
//Loads Project into workspace
var loadProject = function(event) {
    dialog.showOpenDialog(filename => {
        if (filename === undefined) {
            console.log("No File selected");
            return;
        }
        FS.readFile(filename[0], 'utf-8', (err, data) => {
            if (err) {
                console.log("something went wrong: " + err.message)
                return;
            }
            var xml = Blockly.Xml.textToDom(data);
            Blockly.Xml.domToWorkspace(xml, workspace)
        })
    })
    
}

/**
 * Save Project Using Electron File System
 */
function saveProject()
{
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    if (currentpath == "") {
        dialog.showSaveDialog((filename) => {
        if (filename === undefined) {
            console.log("User pressed save but didn't do anything ");
            return;
        }
        currentpath = filename;
        FS.writeFile(filename,xml_text, (err) => {
            if (err) {
                console.log("error saving");
                return;
            }
            else {
                console.log("Saved!")
                alert("Saved!")
            }
        });
        })
    } 

}

function addTab()
{
	var name = prompt("What would you like to call this room?");
	var newTab = document.createElement('div');
	var content = document.createTextNode(name);
	newTab.id = "tab";
	document.body.insertBefore(newTab, document.body.getElementById('tabAddition'));
	
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