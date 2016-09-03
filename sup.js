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
        return exec(config.uploadCmd, {shell: "/bin/bash"}, (err, stdout, stderr) => {
          if (err) {
            return notifier.notify({
              title: '✘ Upload failed',
              message: err.message
            });
          }

          notifier.notify({
            title: '✔ Upload complete',
            message: stdout
          });
        });
      }
    })
  });
