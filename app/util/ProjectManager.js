const defaultProjectFileContents = '<files></files>'
const parser = new DOMParser()
const serializer = new XMLSerializer()
let AsyncFileHelper = require('./AsyncFileHelper')

window.currentProject = {
    tab: 'main',
    files: [
        {
            name: 'main',
            content: ''
        },
        {
            name: 'new',
            content: ''
        }
    ]
}

class ProjectManager {
    static resetProject() {

    }

    static parseProjectFile(data) {
        let xml = parser.parseFromString(data, 'text/xml')
        let files = xml.getElementsByTagName('file')
        
        for(let i = 0; i < files.length; i++) {
            const file = files[i]
            const name = file.getAttribute('name')
            const inner = file.innerHTML

            window.currentProject.files.push({
                name: name,
                content: inner
            })
        }
    }

    static updateCurrentTab(workspace) {
        const file_idx = currentProject.files.findIndex(p => p.name == currentProject.tab)
        if(file_idx > -1) {
            currentProject.files[file_idx].content = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
        }
    }

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