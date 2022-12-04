const path = require('path');
const fs = require('fs-extra');

module.exports = {
    startJavaServer: (appPath, jarPath, port = 8095) => {
        const javaVMParameters = []; //['-Dserver.port=' + port, '-Dtest=test'];
        const windowsJavaPath = 'java.exe';
        const darwinJavaPath = 'java';
        const platform = process.platform;
        var javaPath = 'java';
        if (platform === 'win32') {
            javaPath = windowsJavaPath;
        }
        else if (platform === 'darwin') {
            javaPath = darwinJavaPath;
        }
        console.log(['-jar'].concat(javaVMParameters).concat(jarPath));
        const serverProcess = require('child_process').spawn(javaPath, ['-jar'].concat(javaVMParameters).concat(jarPath), {
            cwd: path.join(appPath, 'jar')
        });
        const dir = path.join(appPath, 'bin')
        if (!fs.existsSync(dir)) {
            console.log('creating bin ...');
            fs.mkdirSync(dir);
        }
        const logFile = path.join(dir, 'jvm.log');
        serverProcess.stdout.pipe(fs.createWriteStream(logFile, {
            flags: 'a'
        })); // logging
        serverProcess.on('error', (code, signal) => {
            setTimeout(function () {
                console.log("could not start jar")
            }, 1000);
            throw new Error('The Application could not be started');
        });
        console.log('Server PID: ' + serverProcess.pid);
        return serverProcess;
    }
}