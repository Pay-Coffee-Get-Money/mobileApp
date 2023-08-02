const express = require('express');

//Gộp các routes vào 1 file index để xuất các routes cho app
const authentication = require("./authentication");
const termManagament = require("./termManagament");
const subjectManagament = require("./subjectManagament");
const courseManagament = require("./courseManagament");

module.exports = {authentication,termManagament,subjectManagament,courseManagament};