var bcash = require("bcash");
var axios = require("axios");

// Establish bitcoin cash seed phrase
var mnemonic = new bcash.Mnemonic("vacant shiver similar power oil real riot food field grow mind wet");
// Convert seed phrase to String
var seedPhrase = (mnemonic.toString());
// convert phrase string to Array
var seedArray = seedPhrase.split(" ");
// convert seed array back to String while removing commas
var reSeed = seedArray.toString(" ").replace(/\,/g, " ");

console.log(reSeed);






