const express = require('express');

//Gộp các routes vào 1 file index để xuất các routes cho app
const authentication = require("./authentication");

module.exports = {authentication};