const express = require('express');

//Gộp các routes vào 1 file index để xuất các routes cho app
const signIn_UpRoute = require("./signIn_Up");

module.exports = {signIn_UpRoute};