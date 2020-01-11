const fs = require('fs')

class AsyncFileHelper {
    static write(file, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, data, err => {
            if(err) reject(err)
            else resolve()
            })
        })
    }

    static read(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if(err) reject(err)
                else resolve(data)
            })
        })
    }
}

module.exports = AsyncFileHelper