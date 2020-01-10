var Blockly = require('blockly')
var Dialogs = require('dialogs')()
var {dialog} = require('electron').remote
var FS = require('fs')
var parser = new DOMParser()
var serializer = new XMLSerializer()


var windows = ['main'] //stores all window names, main being the main function
var currentWindow = "main"; //Stores the current tab open
var currentpath = ""; //pathway of save location (NOT recent.ard)

require('./app/blocks')(Blockly.Blocks)

var blocklyDiv = document.getElementById('blocklyDiv');
var blocklyArea = document.getElementById('blocklyArea');


resetProject();

// Create new Workspace and remove all old workspace(s)
function newProject()
{
	if (workspace.getAllBlocks().length >0 && windows.length ==1){//checks workspace is empty and that the total number of windows is less than 1
		if (confirmLeave()==2) {
            alert("cancelled!");
		} else {
            resetProject();
            
        }
	} else {
        resetProject();
    }
}

function resetProject()
{
    windows= [];
    workspace.clear();
    //reset recent
    var defaultFile = "<files></files>";
    FS.writeFile("recent.ard", defaultFile, (err) => {
        if (err) {
            console.log("There was an error");
        }
        else {
            console.log("recent.ard is good to go!");
        }
    });//resets the recent.ard
    newTab("main");
    currentpath = "";
}

/**
 * Is Run when the + is pressed on the tab section
 */
function addTab()
{
	var name = prompt("What would you like to call this room?");
	var newTab = document.createElement('div');
	var content = document.createTextNode(name);
	newTab.id = "tab";
	document.body.insertBefore(newTab, document.body.getElementById('tabAddition'));
	
}

/**
 * Jquery for when add Button & Change of Tab
 */
/*
$(document).ready(function () {
    $(".tab").click(function(e) {//checks when tab is clicked
        alert("hola");
    });

});
*/

function addTabToBar()
{

}

/**
 * Opens a new Tab
 * adds a new tab and stores it in recent.ard
 */
function newTab(name = "")
{
    if (name.indexOf(' ') >= 0) { //makes sure it doesn't contain space's
        alert("Must not contain spaces");
        return;
    }
    if (name == "") { //makes sure it's not empty
        alert("Window can not be empty");
        return;
    } 
    else if (windows.includes(name)){ //checks if it already exists
        alert("This Already Exists");
        return;
    }
    /** 
    else if (name.match(/^[A-Za-z0-9]+$/)){//Only contains letters and numbers regex
        alert("Must only contains letters & numbers.");
        return;
    }
    */
    else {
        insertToRecent(name);
        windows += name;
        currentWindow = name;
        //Now Add to Screen divs
        workspace.clear();
    }
}

/**
 * Adds a new <file name="x"></file> to recent in <files>
 */
function insertToRecent(name)
{
    var data = "";
    FS.readFile("recent.ard", (err,data2) => {
        if (!err) {data = data2;}
        else {
            console.log("Error reading recent.ard");
            console.log(err.message);
        }
    });
    //try {
        var xml = parser.parseFromString(data, 'text/xml');
        console.log(data);
        var x = xml.createElement("file");
        x.setAttribute("name", name);
        console.log(xml.getElementsByTagName("files"));
        xml.getElementsByTagName("files")[0].appendChild(x);
        
        FS.writeFile("recent.ard", serializer.serializeToString(xml));//converts from DOM to String
    //} catch {
    //    alert("Error editing recent.ard");
    //}
}

/**
 * Save the file basically make recent.ard the other file
 */
function saveProject()
{
    saveCurrentTab();
    var dataToTranfer = "";
    FS.readFile("recent.ard", (err,data) => {
        if (!err) {
            dataToTranfer = data;
            console.log(data+ "has transfered");
        }
        else {
            console.log("Something has gone wrong");
            return;
        }
    });
    if (currentpath == "") {
        console.log("I am here 5");
        var filename = dialog.showSaveDialogSync();//(filename) => {
            if (filename === undefined) {
                console.log("User pressed save but hasn't saved");
                alert("Error 54");
                return;
            }
            currentpath = filename;
        //});
    }
    
    FS.writeFile(currentpath,dataToTranfer, (err) => {
        if (err) {
            console.log("error saving");
            console.log(err.message);
            return;
        }
        else {
            console.log("Saved!")
            alert("Saved!")
        }
        currentpath = filename;
    })
}

/**
 * Applies to recent.ard ONLY RUN BEFORE FULL SAVE
 * as well as changing tabs
 */
function saveCurrentTab()
{
    var datatoedit = "";
    FS.readFile('recent.ard', 'utf-8', (err, data) => {datatoedit=data});
    var xml = parser.parseFromString(datatoedit, 'text/xml');
    var multifiles = xml.getElementsByTagName("file");
    for (i=0; i<multifiles.length; i++) {
        if (multifiles[i].getAttribute("name") == currentwindow) {
            var xml2 = Blockly.Xml.workspaceToDom(workspace);//converts currenttab to Dom then to text
            multifiles[i].innerHTML = Blockly.Xml.domToText(xml2);//puts text of Dom workspace into window in recent
            //xml.getElementsByTagName("file")[i].innerHTML = Blockly.Xml.workspaceToDom(workspace); //Simpler way of saving maybe
        }
    }
    FS.writeFile('recent.ard', xml, (err) => {//rewrites to recent.ard
        if (err) {
            console.log("Something went wrong rewriting recent.ard");
        }
        else {
            console.log("Success in saveCurrentTab()");
        }
    });
}


/**
 * Opens another tab from the file "recent"
 * <files>
 * <file name="x">
 * //Blockly stuff
 * <xml>CONTENT STUFF</XML>
 * //END Blockly stuff
 * </file>
 * </files>
 */
function openTab(page)
{
    saveCurrentTab();
    //Save Current Tab in Recent
    workspace.clear();//clear workspace
    //Opens specific tab
    FS.readFile('recent.ard', 'utf-8', (err, data) => {
        var xml = parser.parseFromString(data, 'text/xml');
        var multifiles = xml.getElementsByTagName("file");
        for (i=0; i<multifiles.length; i++) {
            if (multifiles[i].getAttribute("name") == page) {
                workspace.clear();//clear page before
                inside = multifiles[i].innerHTML;
                xml_text = Blockly.Xml.textToDom(inside);
                Blockly.Xml.domToWorkspace(xml_text, workspace);
                currentWindow = page;
            }
            
        }
});
}

/**
 * Opens a File Stores in recent
 * sets current path to where this is stored
 */
function loadProject()
{
    console.log("IM HERE");
    dialog.showOpenDialog(filename => {
        if (filename === undefined) {
            console.log("didn't press anything");
            return;
        }
        console.log("ANother one bois");
        FS.readFile(filename[0], 'utf-8', (err, data) => {
            if (err) {
                console.log("something went wrong: " + err.message)
                return;
            }
            if (confirmLeave()) {//Makes Sure they want to leave
                openFile(data);
                
            }
        })
    })
}

/**
 * loads file into recent.ard
 * @param {*} data contains the file
 */
function openFile(data)
{
    FS.access('recent.ard', (err) => {
        if (!err) {//If the file already exists
            //erase file and recreate it
            FS.unlinkSync('recent.ard');
            console.log("File recent.ard Deleted");
        } else {
            console.log("Error Deleting: " + err.message)
        }
        FS.writeFile('recent.ard',data, (err2) => {//Write to recent.ard
            if (err2) {
                console.log("there was an error making a recent.ard")
                console.log(err2.message)
                return;
            }
            else {//Open where <file name="main">
                //var xml = Blockly.Xml.textToDom(data);
                var xml = parser.parseFromString(data, 'text/xml');
                //convert text to DOM
                console.log(xml);
                var multifiles = xml.getElementsByTagName("file");
                var inside = "";
                windows = []; //empty list
                for (i=0; i<multifiles.length; i++) {
                    if (multifiles[i].getAttribute("name") == "main") {
                        inside = multifiles[i].innerHTML;
                        xml_text = Blockly.Xml.textToDom(inside);
                        Blockly.Xml.domToWorkspace(xml_text, workspace);
                    }
                    windows += multifiles[i].getAttribute("name");//adds name of file to list
                }
                /*
                multifiles.forEach(element => {//Checks each file for attibute equalling "main";
                    if (element.getAttribute("name") == "main") {
                        inside = element.innerHTML;
                        try {
                        Blockly.Xml.domToWorkspace(inside, workspace);
                        }
                        catch {
                            alert("Something went wrong converting this to workspace...")
                        }
                    }
                });
                */
            }
            })
    });
}

/**
 * The purpose of this is to make sure the user wants to leave without saving
 */
function confirmLeave()
{
    if (workspace.getAllBlocks().length >0 && windows <=1){
        dialog.showMessageBox({type: 'warning', buttons: ['Save', 'Don\'t Save', 'Cancel'], message: 'Would You Like To Save?'}, i => function(i) {
            if (i==0) {//Save
                saveProject()
                return true;
            }
            else if (i==1) {//Don't Save //DELETE AT END
                return true;
            }
            else if (i>1) { //Cancel
                return false;
            }
        }
        )
    }
    return true;
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
/*
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
*/

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

// workspace.addChangeListener(updateCode)