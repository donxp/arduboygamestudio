var { dialog } = require('electron').remote
let ProjectManager = require('../util/ProjectManager.js')
let AsyncFileHelper = require('../util/AsyncFileHelper.js')
let ArduHelper = require('../util/ArduHelper.js');
let Dia = require('dialogs')()
const path = require('path')

Vue.component('project-actions', {
    template: `
    <div>
        <button class="btn btn-sm btn-primary" @click="newProject">New</button>
        <button class="btn btn-sm btn-primary" @click="openProject">Open</button>
        <button class="btn btn-sm btn-primary" @click="saveProject">Save</button>
        <button class="btn btn-sm btn-primary" @click="verifyProject">Verify</button>
        <button class="btn btn-sm btn-primary" @click="uploadProject">Upload</button>
    </div>
    `,
    created() {
        ipcRenderer.on('loadProject', (sender, file) => {
            const projectPath = path.join(window.rootPath, 'examples', file)
            ProjectManager.loadProject(projectPath).then(() => {
                this.$emit('project-loaded')
            })
        })
    },
    methods: {
        newProject: function() {
            ProjectManager.resetProject()
            this.$emit('load-defaults')
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
            //take code and place it into ino file
            console.log("Verifying in PA");
            ArduHelper.verify(Blockly.Arduino.generateAllCode());

        },
        uploadProject: function() {
            console.log("Uploading in PA");
            var comPort = window.selectedPort;
            if (comPort == '') {
                Dia.alert("Please select a Port in Preferences!");
            } else {
                ArduHelper.upload(comPort)
            }
            //process for then uploading to board using set Port
            
        }
    }
})