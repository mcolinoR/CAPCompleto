namespace restaurantes.srv;

using {restaurantes.db as mydb} from '../db/db';
using {northwind} from './external/northwind.csn';


service restaurantesSrv {
    entity Restaurant     as projection on mydb.Restaurant;
    entity Opinion     as projection on mydb.Opinion;
    entity Reservation    as projection on mydb.Reservation;
   

    action createRestaurant(Id_restaurant: Integer, Name: String, Type: String, Opening_hour: Time, Closing_hour: Time, City: String) returns String;
    action createReservation(Id_reservation: Integer, Date: Date, Time: Time, Client_name: String, Num_clients: Integer) returns String;
    function getRestaurants() returns array of Restaurant;
    function getOpinions() returns array of Opinion;
    function getCity(City : String) returns array of Restaurant;
    

    
    @cds.persistence.skip
    entity Customer  as projection on northwind.Customers;

    @cds.persistence.skip
    entity Products  as projection on northwind.Products;
    
    @cds.persistence.skip
    entity jokesapi {
        key id        : Integer;
            type      : String(40);
            setup     : String(255);
            punchline : String(255);
    }
    


}

