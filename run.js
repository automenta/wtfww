#!/usr/bin/env node

const {spawn} = require('child_process')
const path = require('path')

spawn(
    require('electron'),
    [path.join(__dirname, 'main.js')].concat(process.argv.slice(2)), {
        stdio: 'inherit'
    }).on('close', (code) =>
        process.exit(code))
