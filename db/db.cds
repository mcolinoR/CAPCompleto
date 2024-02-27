namespace restaurantes.db;

using { cuid, Country, managed } from '@sap/cds/common';
//localized

//Annotation @assert.range
entity Restaurant {
    key Id_restaurant: Integer;
    Name: String;
    Type: String;
    Opening_hour: Time;
    Closing_hour: Time;
    City: String;
}

entity Opinion {
    key Comment: String ;
    Score: Integer;
}

//Aspect cuid
//Annotation @mandatory
entity Reservation: cuid {
    key Id_reservation: UUID;
    Date: Date @assert.range: ['2024-01-01', '2026-12-31'];
    Time: Time;
    Client_name: String;
    Num_clients: Integer;
}


//otro servicio

entity Menu {
    key Name: String ;
    Price: Decimal;
    Description: String;
    Spiciness: Integer @assert.range: [0, 10];
    Availability: Boolean;
}


