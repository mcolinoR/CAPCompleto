const cds = require('@sap/cds');
const HanaDatabase = require('@sap/cds/libx/_runtime/hana/Service');
module.exports = async function () {

let hanadb = await cds.connect.to('db');

let { Menu } = this.entities;


this.on("getMenus", async (req) => {
    let menus = await hanadb.tx(req).run(SELECT.from(Menu));
    return menus;
});

this.on('createMenu', async (req) => {
    let body = {
        Name: req.data.Name,
        Price:req.data.Price,
        Description:req.data.Description,
        Spiciness:req.data.Spiciness,
        Availability:req.data.Availability,
      
    };
    
    let response = new Promise((resolve, reject) => {
        let oPromise = hanadb.run(INSERT.into(Menu).entries(body));
        oPromise.then(async (oInserted) => {
          
            resolve({ message: "menu created", menu: body });

        }).catch((oErr) => {
            reject(oErr + 'cannot create menu');
        });
    });
    
    return response;
});

}

