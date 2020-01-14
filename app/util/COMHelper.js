const serialport = require('serialport') //Module
const SerialPort = serialport.SerialPort; //


class COMHelper {

    /**
     * Returns a list of all ports
     */
    static checkForPorts()
    {
        return new Promise((resolve,reject) => {
            
            serialport.list(function (err, ports) {
                if (!err) {
                    ports.array.forEach(element => {
                        console.log(element.comName);
                        console.log(element.pnpID);
                        console.log(element.manufacturer);
                    });
                    resolve(ports);
                }
                else {
                    reject("Couldn't list ports");
                }
            });
            
        });
    }
}