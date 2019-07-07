var fs = require('fs');
var _ = require('lodash');
var exec = require('child_process').exec;
var dbOptions =  {
    user: 'root',
    pass: '',
    host: '127.0.0.1',
    port: 27017,
    database: 'ktx',
    autoBackup: true, 
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: './public/backups/' // i.e. /var/database-backup/
};

/* return date object */
exports.stringToDate = function (dateString) {
  return new Date(dateString);
}

// Auto backup script
dbAutoBackUp = function () {
  // check for auto backup is enabled or disabled
      if (dbOptions.autoBackup == true) {
          var currentDate = new Date();
          var beforeDate, oldBackupDir, oldBackupPath;
          var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
          var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
          // check for remove old backup after keeping # of days given in configuration
          if (dbOptions.removeOldBackup == true) {
              beforeDate = _.clone(currentDate);
              beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
              oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
              oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
          }
          var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath; // Command for mongodb dump process
          exec(cmd, function (error, stdout, stderr) {
              if (this.empty(error)) {
                  // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup == true) {
                      if (fs.existsSync(oldBackupPath)) {
                          exec("rm -rf " + oldBackupPath, function (err) { });
                      }
                  }
              }
          });
      }
  }