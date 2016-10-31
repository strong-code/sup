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
    if (path.indexOf(' ') >= 0) {
      console.log('Renaming to friendly path')
      const friendlyPath = path.replace(/ /g, "_");
      fs.renameSync(path, friendlyPath);
      return;
    }
    return fs.stat(path, (err, stats) => {
      if (stats.mtime > startup) {
        const cmd = `. ~/.bash_profile && ${config.uploadCmd} ${path}`;

        return exec(cmd, {shell: "/bin/bash"}, (err, stdout, stderr) => {
          if (err) {
            return notifier.notify({
              title: '✘ Upload failed',
              message: err.message
            });
          }

          notifier.notify({
            title: '✔ Upload complete',
            message: path
          });

        });
      }
    });
  });
