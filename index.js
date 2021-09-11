var bcash = require("bcash");
var axios = require("axios");

// Establish bitcoin cash seed phrase
var mnemonic = new bcash.Mnemonic("vacant shiver similar power oil real riot food field grow mind wet");
var seedPhrase = (mnemonic.toString());
var seedArray = seedPhrase.split(" ");
var reSeed = seedArray.toString(" ").replace(/\,/g, " ");

console.log(reSeed);






