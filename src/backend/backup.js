var fs = require('fs');
var _ = require('lodash');
var exec = require('child_process').exec;
var dbOptions = {
    user: 'root',
    pass: '',
    host: '127.0.0.1',
    port: 27017,
    database: 'ktx',
    autoBackup: true,
    removeOldBackup: true,
    keepLastBackup: 4,
    autoBackupPath: './public/backups/', // i.e. /var/database-backup/
    dayBackup: 6 // today is saturday
};

// Auto backup script
exports.dbAutoBackUp = function () {
    // check for auto backup is enabled or disabled
    var currentDate = new Date();
    console.log('ready to backup')
    if (dbOptions.autoBackup == true && currentDate.getDay() == dbOptions.dayBackup) {
        var beforeDate, oldBackupPath;
        var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        // check for remove old backup after keeping # of days given in configuration
        var cmd = 'mongodump --db ' + dbOptions.database + ' -o ' + dbOptions.autoBackupPath + newBackupDir; // Command for mongodb dump process
        console.log('backup cmd',cmd);
        exec(cmd, function (error, stdout, stderr) {
            console.log('just backup')
            if (!error) {
                // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup) {
                    beforeDate = _.clone(currentDate);
                    beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastBackup * 7); // Substract number of days to keep backup and remove old backup
                    oldBackupPath = dbOptions.autoBackupPath + beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate() // old backup(after keeping # of days)
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) {
                            if (err)
                                console.log('remove backup fail',err)
                            else
                                console.log('remove backup successfully')
                         });
                    }
                }
            }
        });
    }
}