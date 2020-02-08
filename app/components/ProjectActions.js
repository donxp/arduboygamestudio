var { dialog } = require('electron').remote
let ProjectManager = require('../util/ProjectManager.js')
let AsyncFileHelper = require('../util/AsyncFileHelper.js')
let Preferences = require('../components/Preferences.js')

let {spawn} = require('child_process')



Vue.component('project-actions', {
    template: `
    <div>
        <button class="btn btn-sm btn-primary" onClick="newProject()">New</button>
        <button class="btn btn-sm btn-primary" @click="openProject">Open</button>
        <button class="btn btn-sm btn-primary" @click="saveProject">Save</button>
        <button class="btn btn-sm btn-primary" onClick="newProject()">Verify</button>
        <button class="btn btn-sm btn-primary" onClick="newProject()">Upload</button>
    </div>
    `,
    methods: {
        newProject: function() {

        },
        openProject: function() {
            dialog.showOpenDialog({
                title: 'Open a Arduboy Project',
                multiSelections: false,
                filters: [
                    {
                        name: 'Arduboy Project',
                        extensions: ['ard']
                    }
                ]
            }).then(selection => {
                if(selection.canceled || selection.filePaths.length < 1) return

                ProjectManager.loadProject(selection.filePaths[0]).then(() => {
                    this.$emit('project-loaded')
                })
            })
        },
        saveProject: function() {
            dialog.showSaveDialog({
                title: 'Save a Arduboy Project',
                filters: [
                    {
                        name: 'Arduboy Project',
                        extensions: ['ard']
                    }
                ]
            }).then(selection => {
                if(selection.canceled) return

                let path = selection.filePath
                if(!path.endsWith('.ard')) {
                    path += '.ard'
                }

                ProjectManager.updateCurrentTab(window.workspace)
                ProjectManager.saveProject(path).then(() => {
                    console.log('project saved successfully')
                })
            })
        },
        verifyProject: function() {
            //
//C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\arduino-builder -dump-prefs -logger=machine -hardware C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware -hardware C:\Users\thoma\Documents\ArduinoData\packages -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\tools-builder -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware\tools\avr -tools C:\Users\thoma\Documents\ArduinoData\packages -built-in-libraries C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\libraries -libraries C:\Users\thoma\Documents\Arduino\libraries -fqbn=arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx -ide-version=10811 -build-path C:\Users\thoma\AppData\Local\Temp\arduino_build_372733 -warnings=none -build-cache C:\Users\thoma\AppData\Local\Temp\arduino_cache_143338 -prefs=build.warn_data_percentage=75 -verbose C:\Users\thoma\AppData\Local\Temp\untitled1267264915.tmp\sketch_feb08a\sketch_feb08a.ino
//C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\arduino-builder -compile -logger=machine -hardware C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware -hardware C:\Users\thoma\Documents\ArduinoData\packages -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\tools-builder -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware\tools\avr -tools C:\Users\thoma\Documents\ArduinoData\packages -built-in-libraries C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\libraries -libraries C:\Users\thoma\Documents\Arduino\libraries -fqbn=arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx -ide-version=10811 -build-path C:\Users\thoma\AppData\Local\Temp\arduino_build_372733 -warnings=none -build-cache C:\Users\thoma\AppData\Local\Temp\arduino_cache_143338 -prefs=build.warn_data_percentage=75 -verbose C:\Users\thoma\AppData\Local\Temp\untitled1267264915.tmp\sketch_feb08a\sketch_feb08a.ino
            var buildpath = '';
            var arduino = 'C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt';
            var arduinobuilder = arduino + '\arduino-builder';
            var arduinohardware = arduino + '\hardware';
            var arduinohardware2 = 'C:\Users\thoma\Documents\ArduinoData\packages';
            var arduinotools = arduino + '\toolsbuilder';
            var arduinotools2 = arduinohardware + '\tools\avr';
            var arduinotools3 = arduinohardware2;
            var arduinolibraries = arduino + '\libraries';
            var fqbn = 'arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx';
            var command = '';
            //process for compiling to hex
            spawn(command, function (error,stdout,stderr) {
                console.log(stdout);
            });
            


        },
        uploadProject: function() {
            var comPort = Preferences.getPort();
            if (comPort == '') {
                alert("Please select a Port in Preferences!");
            }
            //process for then uploading to board using set Port
            
        }
    }
})