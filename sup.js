'use strict';

const chokidar = require('chokidar');
const watchDir = require('./config.json').watchDir;
const fs       = require('fs');
const sys      = require('sys');
const exec     = require('child_process').exec;
const notifier = require('node-notifier');
const startup  = new Date();

const watcher  = chokidar.watch(watchDir, {
  ignored: /[\/\\]\//,
  persistent: true
})
  .on('add', (path) => {
    return fs.stat(path, (err, stats) => {
      if (stats.mtime > startup) {
        const cmd = `curl sicp.me -F file=@"${path}" | tee >(pbcopy) | xargs echo`;
        return exec(cmd, {shell: "/bin/bash"}, (err, stdout, stderr) => {
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
