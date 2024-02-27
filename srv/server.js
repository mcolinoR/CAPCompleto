const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const cds = require("@sap/cds");
 
cds.once("bootstrap", (app) => {
  console.log(`Server start time is: ${new Date()}`);
  app.use(proxy());
});
 
module.exports = cds.server;