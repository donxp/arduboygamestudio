
let process = require('child_process')
let FileHelper = require('./AsyncFileHelper.js')

class ArduHelper {
    
                    //
        //C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\arduino-builder -dump-prefs -logger=machine -hardware C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware -hardware C:\Users\thoma\Documents\ArduinoData\packages -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\tools-builder -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware\tools\avr -tools C:\Users\thoma\Documents\ArduinoData\packages -built-in-libraries C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\libraries -libraries C:\Users\thoma\Documents\Arduino\libraries -fqbn=arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx -ide-version=10811 -build-path C:\Users\thoma\AppData\Local\Temp\arduino_build_372733 -warnings=none -build-cache C:\Users\thoma\AppData\Local\Temp\arduino_cache_143338 -prefs=build.warn_data_percentage=75 -verbose C:\Users\thoma\AppData\Local\Temp\untitled1267264915.tmp\sketch_feb08a\sketch_feb08a.ino
        //avrdude compilation
        //C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\arduino-builder -compile
        // -logger=machine -hardware C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware
        // -hardware C:\Users\thoma\Documents\ArduinoData\packages 
        // -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\tools-builder 
        // -tools C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\hardware\tools\avr 
        // -tools C:\Users\thoma\Documents\ArduinoData\packages 
        // -built-in-libraries C:\Program Files\WindowsApps\ArduinoLLC.ArduinoIDE_1.8.29.0_x86__mdqgnx93n4wtt\libraries
        //  -libraries C:\Users\thoma\Documents\Arduino\libraries 
        // -fqbn=arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx 
        // -ide-version=10811 -build-path C:\Users\thoma\AppData\Local\Temp\arduino_build_372733 
        // -warnings=none -build-cache C:\Users\thoma\AppData\Local\Temp\arduino_cache_143338 
        // -prefs=build.warn_data_percentage=75 
        // -verbose C:\Users\thoma\AppData\Local\Temp\untitled1267264915.tmp\sketch_feb08a\sketch_feb08a.ino
        /** 
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
        var ide = '10811';
        var buildpath = 'C:\Users\thoma\AppData\Local\Temp\arduino_build_372733';
        var buildcache = 'C:\Users\thoma\AppData\Local\Temp\arduino_cache_143338';
        var prefs = 'build.warn_data_percentage=75'
        var verbose = 'C:\Users\thoma\AppData\Local\Temp\untitled.tmp\sketch_feb08a\sketch_feb08a.ino';
        var command = 'arduino-builder -compile -logger=machine -hardware ' + arduinohardware + ' -hardware ' + arduinohardware2 + ' -tools ' + arduinotools + 
            ' -tools ' + arduinotools2 + ' -tools ' + arduinotools3 + ' -built-in-libraries ' + arduinolibraries + ' -fqbn ' + fqbn +
            ' -ide-version=' + ide + ' -build-path ' + buildpath + ' -warnings=none -build-cache ' + buildcache + ' -pres=' + prefs +
            ' -verbose ' + verbose;
            */
        //process for compiling to hex
        //spawn(command, function (error,stdout,stderr) {
          //  console.log(stdout);
        //});
    static setup() {
        var options = {cwd: '/bats/', shell: true}
        let ls = process.spawn('setup.bat', {}, options)//sets up basic files from arduinoIDE source files
        //let ls = process.exec('setup.bat', options)
    }
    static verify(data) {
        var options = {cwd: '/bats/', shell: true}
        //put the text into the file (HelloWorld)
        //==================================================================================================MARKER LOOK HERE PLEASE!
        FileHelper.write('arduino-cli/HelloWorld/HelloWorld.ino', data)
        //compile text
        let ls = process.spawn('verify.bat', {}, options)
    }

    static upload(comPort) {
        //get the global selectedPort value
        var options = {cwd: '/bats/'}
        let ls = process.exec('upload.bat ' + comPort, {}, function(err, stdout, stderr) { 
            console.log('stdout:' + stdout);
            console.log('stderr:' + stderr);
            console.log('err: ' + err);
            
        })
        

    }
}
module.exports = ArduHelper