var Blockly = require('blockly')

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
    console.log('Resizing:', blocklyArea)
};
window.addEventListener('resize', onresize, false);
onresize()
Blockly.svgResize(workspace)


function newProject() {
	if (workspace.getAllBlocks().length >0){
		if (!confirm("Do You Wish to save?")) {
			workspace.clear()
		} else {
			alert("Not saved")
		}
	} else {
		alert("THERE WAS NO BLOCKS DETECTED")
		workspace.clear()
	}
}

function updateCode() {
    console.log('Updating textarea')
    var code = Blockly.Arduino.workspaceToCode(workspace)
    document.getElementById('code').value = code
}

workspace.addChangeListener(updateCode)