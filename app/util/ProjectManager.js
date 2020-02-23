const defaultProjectFileContents = '<files></files>'
const parser = new DOMParser()
const serializer = new XMLSerializer()
let AsyncFileHelper = require('./AsyncFileHelper')
const pif = require('./pixeldata')

window.currentProject = {
    tab: 'main',
    path: null,
    files: [
        {
            name: 'main',
            content: null
        }
    ],
    sprites: []
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

            if(name == 'main') {
                ProjectManager.loadContentIntoWorkspace(window.workspace, inner)
            }
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
                // ProjectManager.switchToTab(window.currentProject.files[0].name)
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

    static generateSpriteArray() {
        const sprites = window.currentProject.sprites
        const resultSprites = []
        for(let i = 0; i < sprites.length; i++) {
            const matrix = ProjectManager.rotateMatrix(sprites[i].image)
            const lines = [
                // `! sprite ${sprites[i].image.length}x${sprites[i].image[0].length}`
            ]
            for(let row = 0; row < matrix.length; row++) {
                lines.push(matrix[row].map(p => p ? '#' : '.').join(''))
            }
            console.log(lines)
            resultSprites.push({
                name: sprites[i].name,
                code: (window.PixelData(lines.join('\n'))).c()
            })
        }
        return resultSprites
    }

    static rotateMatrix(matrix) {
        let result = []
        for(let i = 0; i < matrix[0].length; i++) {
            let row = matrix.map(e => e[i])
            result.push(row)
        }
        return result
    }

}

module.exports = ProjectManager