/*
    http://tau-prolog.org/manual/compatibility-with-nodejs
 */
var P = require( "./lib/prolog/core.js" );
require( "./lib/prolog/lists.js" )( P );

var session = P.create( 1000 );

// Load the program
var program =
    // Products
    "item(id(1), name(bread))." +
    "item(id(2), name(water))." +
    "item(id(3), name(apple))." +
    // Shops
    "shop(id(1), name(tau), location(spain))." +
    "shop(id(2), name(swi), location(netherlands))." +
    // Stock
    "stock(item(1), shop(1), count(23), price(0.33))." +
    "stock(item(2), shop(1), count(17), price(0.25))." +
    "stock(item(2), shop(2), count(34), price(0.31))." +
    "stock(item(3), shop(2), count(15), price(0.45)).";
session.consult( program );

// Get Node.js argument: nodejs ./script.js item
var item = 'bread';//process.argv[2];

// Query the goal
session.query( "item(id(ItemID), name(" + item + ")), stock(item(ItemID), shop(ShopID), _, price(Price)), shop(id(ShopID), name(Shop), _)." );

// Show answers
session.answers( x => console.log( P.format_answer(x) ) );