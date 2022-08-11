'use strict'

// creating a base name for the mongodb
// REPLACE THE STRING WITH YOUR OWN DATABASE NAME
const mongooseBaseName = 'snowboard'

// create the mongodb uri for development and test
const database = {
	// development: `mongodb://localhost/${mongooseBaseName}-development`,
	development: `mongodb://127.0.0.1/${mongooseBaseName}-development`,
	// test: `mongodb://localhost/${mongooseBaseName}-test`,
	test: `mongodb://127.0.0.1/${mongooseBaseName}-test`,
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable MONGODB_URI will be available in
// heroku production evironment otherwise use test or development db
const currentDb = process.env.MONGODB_URI || localDb

// mongodb+srv://tinhi3:sei2022@cluster0.royabj1.mongodb.net/snowboardapi?retryWrites=true&w=majority

module.exports = currentDb
