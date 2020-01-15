const serialport = require('serialport') //Module
const SerialPort = serialport.SerialPort; //

const board = {
    name: 'sf-pro-micro'

}

class COMHelper {

    /**
     * Returns a list of all ports or throws error
     */
    static checkForPorts()
    {
        // return new Promise((resolve,reject) => {
        //     serialport.list(function (err, ports) {
        //         if (!err) {
        //             ports.array.forEach(element => {
        //                 console.log(element.comName);//debugging
        //                 console.log(element.pnpID);
        //                 console.log(element.manufacturer);
        //             });
        //             resolve(ports);
        //         }
        //         else {
        //             reject("Could not list ports Error: " + err.message);
        //         }
        //     });
        // });
        return serialport.list()
    }

        

    /**
     * Attempt to upload some Code
     */
    static uploadToDevice(device,data)
    {
        return new Promise((resolve, reject) => {
            //Might use Avrgirl library to upload to device


            //Convert data to a hex file

            //push to device
        });
    }

}
module.exports = COMHelper