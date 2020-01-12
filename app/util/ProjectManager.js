const defaultProjectFileContents = '<files></files>'
const parser = new DOMParser()
const serializer = new XMLSerializer()
let AsyncFileHelper = require('./AsyncFileHelper')

window.currentProject = {
    tab: 'main',
    path: null,
    files: [
        {
            name: 'main',
            content: null
        }
    ]
}

class ProjectManager {

    /**
     * Create new tab
     * @param {*} name 
     */
    static createTab(name) {
        window.currentProject.files.push({
            name: name,
            content: null
        })
    }

    /**
     * Switch to tab
     * @param {*} tabName 
     */
    static switchToTab(tabName) {
        const tab_idx = window.currentProject.files.findIndex(p => p.name == tabName)
        if(tab_idx > -1) {
            // update current tab before switching
            ProjectManager.updateCurrentTab(window.workspace)

            window.workspace.clear()
            window.currentProject.tab = tabName
            const content = window.currentProject.files[tab_idx].content

            if(content != null) {
                this.loadContentIntoWorkspace(window.workspace, content)
            }
        }   
    }

    /**
     * Load string xml content into workspace.
     * @param {*} workspace 
     * @param {*} content 
     */
    static loadContentIntoWorkspace(workspace, content) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(content), workspace)
    }

    /**
     * Reset project back to original state.
     */
    static resetProject() {
        window.currentProject.tab = 'main'
        window.currentProject.files = [
            {
                name: 'main',
                content: ''
            }
        ]
        window.currentProject.path = null
        window.workspace.clear()
    }

    /**
     * Parse xml project file.
     * @param {*} data xml data
     */
    static parseProjectFile(data) {
        let xml = parser.parseFromString(data, 'text/xml')
        let files = xml.getElementsByTagName('file')
        
        const projectFiles = []
        for(let i = 0; i < files.length; i++) {
            const file = files[i]
            const name = file.getAttribute('name')
            const inner = file.innerHTML

            projectFiles.push({
                name: name,
                content: inner
            })
        }
        window.currentProject.files = projectFiles
    }

    /**
     * Load project from a path
     * @param {*} path 
     */
    static loadProject(path) {
        return new Promise((resolve, reject) => {
            AsyncFileHelper.read(path).then(data => {
                ProjectManager.resetProject()
                ProjectManager.parseProjectFile(data)
                window.currentProject.path = path
                resolve()
            }).catch(err => {
                reject('Unable to open project file ' + path + ', error: ' + err.toString())
            })
        })
    }

    /**
     * Update project state by updating latest xml data from active tab.
     * @param {*} workspace 
     */
    static updateCurrentTab(workspace) {
        const file_idx = currentProject.files.findIndex(p => p.name == currentProject.tab)
        if(file_idx > -1) {
            currentProject.files[file_idx].content = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
        }
    }

    /**
     * Save project to a path.
     * @param {*} path 
     */
    static saveProject(path) {
        const root = document.implementation.createDocument(null, 'files')

        for(let i = 0; i < window.currentProject.files.length; i++) {
            const file = window.currentProject.files[i]
            const fileNode = root.createElement('file')
            fileNode.setAttribute('name', file.name)
            fileNode.innerHTML = file.content
            root.documentElement.appendChild(fileNode)
        }

        const serialized = serializer.serializeToString(root)
        console.log('serialized:', serialized)
        return AsyncFileHelper.write(path, serialized)
    }
}

module.exports = ProjectManager