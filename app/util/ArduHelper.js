
let process = require('child_process')
let FileHelper = require('./AsyncFileHelper.js')
const Dialog = require('dialogs')()

class ArduHelper {
    static setup() {
        let ls = process.spawn('setup.bat', {})//sets up basic files from arduinoIDE source files
    }
    static verify(data) {
        Dialog.alert("Compiling Please Wait");
        //put the text into the file (HelloWorld)
        console.log("Write to HelloWorld.ino");
        FileHelper.write('arduino-cli/HelloWorld/HelloWorld.ino', data)
        //compile text
        console.log("Starting Compile")

        let ls = process.exec('verify.bat', {}, function(err, stdout, stderr) { 
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
        let ls = process.exec('upload.bat ' + comPort, {}, function(err, stdout, stderr) { 
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