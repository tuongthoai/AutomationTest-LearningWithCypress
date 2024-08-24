const { defineConfig } = require("cypress");
// Populate process.env with values from .env file
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    
  },
  env: {
    access_token: process.env.AUTH_ACCESS_TOKEN,
  },
});
