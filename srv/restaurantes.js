const cds = require('@sap/cds');
const HanaDatabase = require('@sap/cds/libx/_runtime/hana/Service');
module.exports = async function () {

let hanadb = await cds.connect.to('db');
let northwindsrv = await cds.connect.to('northwind');
let jokes = await cds.connect.to("restapi");

let { Restaurant } = this.entities;
let { Opinion } = this.entities;
let { Reservation } = this.entities;
let { Products } = this.entities;
let { Customer } = this.entities;


this.on("getRestaurants", async (req) => {
    let restaurants = await hanadb.tx(req).run(SELECT.from(Restaurant));
    return restaurants;
});

this.on("getOpinions", async (req) => {
    let opinions = await hanadb.tx(req).run(SELECT.from(Opinion));
    return opinions;
});

this.on('getCity', async (req) => {
    const tx = cds.transaction(req);
    const { Restaurant } = cds.entities;
    let restaurantslist = await tx.run(SELECT.from(Restaurant).where({City: req.data.City }));
    return restaurantslist;
});

//no devuelve el dato creado por eso no lo puedo recuperar para luego mostrarlo en la tabla
this.on('createRestaurant', async (req) => {
    let body = {
        Id_restaurant: req.data.Id_restaurant,
        Name:req.data.Name,
        Type:req.data.Type,
        Opening_hour:req.data.Opening_hour,
        Closing_hour:req.data.Closing_hour,
        City:req.data.City,
    };
    
    let response = new Promise((resolve, reject) => {
        let oPromise = hanadb.run(INSERT.into(Restaurant).entries(body));
        oPromise.then(async (oInserted) => {
          
            resolve({ message: "restaurant created", restaurant: body });

        }).catch((oErr) => {
            reject(oErr + 'cannot create restaurant');
        });
    });
    
    return response;
});

/*

this.on('createMix', async (req) => {
    let body = {
        Name: req.data.Name,
        Address:req.data.Address,
        City:req.data.City,
        Punchline:req.data.Punchline,
        
    }
    let response = new Promise((resolve, reject) => {
        let oPromise = hanadb.run(INSERT.into(MixTB).entries(body));
        oPromise.then(async (oInserted) => {
            resolve("mix created");

        }).catch((oErr) => {
            reject(oErr + 'cannot create mix');
        })
    });
    return response;


});

*/
this.on('READ', Products, async (req) => {
    return northwindsrv.tx(req).run(req.query);
});
this.on('READ', Customer, async (req) => {
    return northwindsrv.tx(req).run(req.query);
});

this.on('READ', 'jokesapi', async (req) => {
    let sQuery = "/random_ten";
    const ten_jokes = await jokes.tx(req).get(sQuery);
    return ten_jokes;
});


}


