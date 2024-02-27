sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project1/libs/call",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

   
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, call, MessageBox, JSONModel,Filter, FilterOperator) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                //var oDataPrincipal = new sap.ui.model.json.JSONModel({ "data": [] });
                //this.getView().setModel(oDataPrincipal, "model");
                let interval = setInterval(function () {
                    if (this.getView().getModel("restaurantsModel"))
                    {
                      this.getRestaurants();
                      clearInterval(interval);
                     
                    }
                }.bind(this));
            },
                
        getRestaurants: function() {
            var oModel = this.getOwnerComponent().getModel("restaurantsModel");
            var oComboBox=this.getView().byId("selectRestaurant")
        
            return new Promise(function(resolve, reject) {
                var successFn = function(data, header) {
                    console.log(data);
                    var oModelComboBox = new sap.ui.model.json.JSONModel(data.results);
                    oModelComboBox.setSizeLimit(3000);
                    oComboBox.setModel(oModelComboBox);

                    var oItem = new sap.ui.core.Item(
                        {
                            key: "{Id_restaurant}", 
                            text: "{Name}", 
                            //additionalText: "{Age}"
                        }
                    );
                    oComboBox.bindAggregation("items", "/", oItem);

                    resolve(data);
                }.bind(this);
        
                var errorFn = function(err) {
                    console.log(err);
                    reject(err);
                };
        
                call.get(this, oModel, "/getRestaurants", [], {}, successFn, errorFn, null);
            }.bind(this));
        },

        getRestaurantFilterByCity: function() {
            var oModel = this.getOwnerComponent().getModel("restaurantsModel");
            var successFn = function (data, header) {
                var modelTable = this.getView().getModel("modelTable");
        
                if (!modelTable) {
                    modelTable = new sap.ui.model.json.JSONModel();
                    modelTable.setSizeLimit(3000);
                    this.getView().setModel(modelTable, "modelTable");
                }
                var data_filter = {
                    idEX: data.results[0].Id_restaurant,
                    nameEX: data.results[0].Name,
                    typeEX: data.results[0].Type,
                    openHourEX: data.results[0].Opening_hour,
                    closeHourEX: data.results[0].Closing_hour,
                    cityEX: data.results[0].City,

                };
        
                this.getView().getModel("modelTable").setProperty("/results", [data_filter]);
                //console.log(data_filter.openHourEX)

            }.bind(this);
        
            var errorFn = function (err) {
                console.log(err);
            };

            call.get(this, oModel, "/getCity", [], {City: "Madrid"}, successFn, errorFn, null);
           
            
        },
            
        onCreateRestaurant: function () {
            var oModel = this.getOwnerComponent().getModel("restaurantsModel");
            var id = this.getView().byId("id1").getValue();
            var name = this.getView().byId("id2").getValue();
            var type = this.getView().byId("id3").getValue();
            var open_hour = this.getView().byId("id4").getValue(); 
            this.formatHour(open_hour);
            var close_hour = this.getView().byId("id5").getValue(); 
            this.formatHour(close_hour);
            var city = this.getView().byId("id6").getValue();
           
            var body = {
                Id_restaurant:id,
                Name:name,
                Type:type,
                Opening_hour:open_hour,
                Closing_hour:close_hour,
                City:city
            };

            var fnSuccess = function (data, header) {
                console.log(data);
                var modelTable2 = this.getView().getModel("modelTable");
        
                if (!modelTable2) {
                    modelTable2 = new sap.ui.model.json.JSONModel();
                    modelTable2.setSizeLimit(3000);
                    this.getView().setModel(modelTable2, "modelTable");
                }
        
                var data_created = {};
                data_created.idEX = data.createRestaurant.restaurant.Id_restaurant
                data_created.nameEX = data.createRestaurant.restaurant.Name;
                data_created.typeEX = data.createRestaurant.restaurant.Type;
                data_created.openHourEX = data.createRestaurant.restaurant.Opening_hour;
                data_created.closeHourEX = data.createRestaurant.restaurant.Closing_hour,    
                data_created.cityEX = data.createRestaurant.restaurant.City,          

        
                this.getView().getModel("modelTable").setProperty("/results2", [data_created]);
            }.bind(this);
        
            var fnError = function (err) {
                console.log(err);
            };
        
            call.create(this, oModel, "/createRestaurant", body , fnSuccess, fnError, {});
        },
    
        formatHour: function (hourString) {
   
            if (!hourString.includes(".")) {
                hourString += ".000";
            }
            return hourString;
        },

        getOpinions:function()
        {
            var oModel = this.getOwnerComponent().getModel("restaurantsModel");
        
            return new Promise(function(resolve, reject) {
                var successFn = function(data, header) {
                    console.log(data);
                }.bind(this);
        
                var errorFn = function(err) {
                    console.log(err);
                    reject(err);
                };
        
                call.get(this, oModel, "/getOpinions", [], {}, successFn, errorFn, null);
            }.bind(this));

        },

        getCustomersNorthwind: function() {
            var oModel = this.getOwnerComponent().getModel("restaurantsModel");
            var successFn = function (data, header) {
                console.log(data)
            }.bind(this);
        
            var errorFn = function (err) {
                console.log(err);
            };
            call.get(this, oModel, "/Customer", [], {}, successFn, errorFn, null);
            
        },

         //hecho por entidad
         getApi: function() {
            var oModel = this.getOwnerComponent().getModel("restaurantsModel");
            var successFn = function (data, header) {
                console.log(data)
            }.bind(this);
        
            var errorFn = function (err) {
                console.log(err);
            };
            call.get(this, oModel, "/jokesapi", [], {}, successFn, errorFn, null);
            
        },




        //a partir de aqui es el otro servicio
        
        getMenus:function()
        {
            var oModel = this.getOwnerComponent().getModel("menusModel");
        
            return new Promise(function(resolve, reject) {
                var successFn = function(data, header) {
                    console.log(data);
                }.bind(this);
        
                var errorFn = function(err) {
                    console.log(err);
                    reject(err);
                };
        
                call.get(this, oModel, "/getMenus", [], {}, successFn, errorFn, null);
            }.bind(this));

        },

        onCreateMenu: function () {
            var oModel = this.getOwnerComponent().getModel("menusModel");
            var name_menu = this.getView().byId("id7").getValue();
            var price_menu = this.getView().byId("id8").getValue();
            var descript_menu = this.getView().byId("id9").getValue();
            var spice_menu = this.getView().byId("id10").getValue(); 
            var avail_menu = this.getView().byId("id11").getValue(); 

           
            var body = {
                Name:name_menu,
                Price:price_menu,
                Description:descript_menu,
                Spiciness:spice_menu,
                Availability:avail_menu,
            };

            var fnSuccess = function (data, header) {
                console.log(data);
                var modelTable2 = this.getView().getModel("modelTable2");
        
                if (!modelTable2) {
                    modelTable2 = new sap.ui.model.json.JSONModel();
                    modelTable2.setSizeLimit(3000);
                    this.getView().setModel(modelTable2, "modelTable2");
                }
        
                var data_created = {};
                data_created.nameeEX = data.createMenu.menu.Name
                data_created.priceeEX = data.createMenu.menu.Price;
                data_created.descriptionnEX = data.createMenu.menu.Description;
                data_created.spiceEX = data.createMenu.menu.Spiciness;
                data_created.availableEX = data.createMenu.menu.Availability,    

        
                this.getView().getModel("modelTable2").setProperty("/results2", [data_created]);
            }.bind(this);
        
            var fnError = function (err) {
                console.log(err);
            };
        
            call.create(this, oModel, "/createMenu", body , fnSuccess, fnError, {});
        },



      
});
});
