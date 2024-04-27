module.exports = (filename, args = []) => {
    return new Promise((resolve, reject) => {
       const {PythonShell} = require('python-shell')

       PythonShell.run(filename, {
        args
       }, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      });
    })
}