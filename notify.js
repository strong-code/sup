#!/usr/bin/env node

var note = require('node-notifier');

note.notify({
    title: 'Blink',
    message: '20 seconds'
})
