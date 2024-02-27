namespace menus.srv;

using {restaurantes.db as mydb} from '../db/db';


service menusSrv {
    entity Menu     as projection on mydb.Menu;

    action createMenu(Name: String, Price: Decimal, Description: String, Spiciness: Integer, Availability: Boolean) returns String;
    function getMenus() returns array of Menu;


}

