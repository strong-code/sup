'use strict';

const chokidar = require('chokidar');
const config   = require('./config.json');
const fs       = require('fs');
const sys      = require('sys');
const exec     = require('child_process').exec;
const notifier = require('node-notifier');
const startup  = new Date();

const watcher  = chokidar.watch(config.watchDir, {
  ignored: /[\/\\]\//,
  persistent: true
})
  .on('add', (path) => {
    return fs.stat(path, (err, stats) => {
      if (stats.mtime > startup) {
        const friendlyPath = path.replace(/ /g, "_");
        fs.renameSync(path, friendlyPath);
        const cmd = `. ~/.bash_profile && ${config.uploadCmd} ${friendlyPath}`;

        return exec(cmd, {shell: "/bin/bash"}, (err, stdout, stderr) => {
          if (err) {
            return notifier.notify({
              title: '✘ Upload failed',
              message: err.message
            });
          }

          notifier.notify({
            title: '✔ Upload complete',
            message: friendlyPath
          });

        });
      }
    });
  });
