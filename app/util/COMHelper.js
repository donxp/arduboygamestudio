const serialport = require('serialport') //Module
const SerialPort = serialport.SerialPort; //

class COMHelper {

    /**
     * Returns a list of all ports or throws error
     */
    static checkForPorts()
    {
        return serialport.list()
    }
}
module.exports = COMHelper