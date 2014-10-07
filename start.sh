#!/bin/sh
pkill ApEmailer
npm install
nohup node main.js >> nohup.log 2>&1 &
