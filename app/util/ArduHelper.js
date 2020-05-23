
let process = require('child_process')
let FileHelper = require('./AsyncFileHelper.js')
const Dialog = require('dialogs')()
const path = require('path')

class ArduHelper {

    static isRunningBuilt() {
        return __dirname.includes('app.asar')
    }

    static getPathToArduinoCliProject() {
        if(ArduHelper.isRunningBuilt()) {
            return path.join(window.rootPath, '..')
        } else {
            // return path.join(window.rootPath, 'arduino-cli')
            return path.join(window.rootPath)
        }
    }

    static getBatchFilePath(batch) {
        if(ArduHelper.isRunningBuilt()) {
            return path.join(window.rootPath, '../', batch)
        } else {
            return path.join(window.rootPath, batch)
        }
    }

    static setup() {
        const projectPath = ArduHelper.getPathToArduinoCliProject()
        const batchPath = ArduHelper.getBatchFilePath('setup.bat')
        let ls = process.spawn(batchPath, [projectPath], {})//sets up basic files from arduinoIDE source files
    }
    static verify(data) {
        Dialog.alert("Compiling Please Wait");
        //put the text into the file (HelloWorld)
        console.log("Write to HelloWorld.ino");
        const projectPath = ArduHelper.getPathToArduinoCliProject()
        const filePath = path.join(projectPath, 'HelloWorld', 'HelloWorld.ino')
        FileHelper.write(filePath, data)
        //compile text
        console.log("Starting Compile")

        const batchPath = ArduHelper.getBatchFilePath('verify.bat')
        console.log('project path:', projectPath)
        let ls = process.exec(`"${batchPath}" "${projectPath}"`, {}, function(err, stdout, stderr) { 
            console.log('stdout:' + stdout);
            console.log('stderr:' + stderr);
            console.log('err: ' + err);
        })
        ls.on('close', (code) => {
            Dialog.cancel();
            if (code==0) {
                Dialog.alert("Compiled successfully!");
            }
            else {
                Dialog.alert("There was an error Compiling!");
            }
            console.log(`Compilation finished with code:  ${code}`);
          });
    }

    static upload(comPort) {
        Dialog.alert("Uploading, Please Wait!");
        const batchPath = ArduHelper.getBatchFilePath('upload.bat')
        const projectPath = ArduHelper.getPathToArduinoCliProject()
        let ls = process.exec(`"${batchPath}" "${projectPath}" ${comPort}`, {}, function(err, stdout, stderr) { 
            console.log('stdout:' + stdout);
            console.log('stderr:' + stderr);
            console.log('err: ' + err);
        })
        
        ls.on('close', (code) => {
           Dialog.cancel();
            if (code != 0) {//Checks if there was an error compiling
               Dialog.alert("There was a Problem Uploading! Error Code:" +  code);
            }
            else {
                Dialog.alert("Successfully uploaded to the Arduboy!");
            }
            
            console.log(`Uploading finished with code:  ${code}`);
          });

    }


}
module.exports = ArduHelper