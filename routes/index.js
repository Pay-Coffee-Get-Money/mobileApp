const express = require('express');

//Gộp các routes vào 1 file index để xuất các routes cho app
const authentication = require("./authentication");
const termManagament = require("./termManagament");
const subjectManagament = require("./subjectManagament");
const courseManagament = require("./courseManagament");
const topicManagament = require("./topicManagament");
const groupManagament = require("./groupManagament");
const deadlineManagament = require("./deadlineManagament");
const specializationManagament = require("./specializationManagament");
const fileManagament = require("./fileManagament");
const userManagament = require("./userManagament");
const academicYearManagament = require("./academicYearManagament");
const registrationRequiredManagament = require("./registrationRequiredManagament");

module.exports = {authentication,
    termManagament,
    subjectManagament,
    courseManagament,
    topicManagament,
    groupManagament,
    deadlineManagament,
    specializationManagament,
    fileManagament,
    userManagament,
    academicYearManagament,
    registrationRequiredManagament
};