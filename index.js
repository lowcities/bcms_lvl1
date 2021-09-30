

var bcash = require("bcash");
var axios = require("axios");
const {WalletClient, Network, WalletDB, KeyRing} = require('bcash');
// Establish BCH network
const network = Network.get('main');




// Establish bitcoin cash seed phrase
var mnemonic = new bcash.Mnemonic("vacant shiver similar power oil real riot food field grow mind wet");


// Convert seed phrase to String
var seedPhrase = mnemonic.toString();
// convert phrase string to Array
var phraseArray = seedPhrase.split(" ");
// // convert seed array back to String while removing commas
var rePhrase = phraseArray.join(' ');

// // console.log("Array: ", phraseArray);


var master = bcash.hd.fromMnemonic(mnemonic); 
var hdkey = master.derivePath("m/44'/145'/0/0'/0");
var xpubKey  = hdkey.xpubkey();//Derive Extended public key
var child = hdkey.derive(0, false);//Derive a child key from master key
var ringLegacy = KeyRing.fromPublic(child.publicKey);
var legAddress = ringLegacy.getAddress('base58', network);//create address from public key


let addressArray = [];
let temp;
for(let i = 0; i <= 20; i++) {
    temp = hdkey.derive(i, false);
    addressArray.push(KeyRing.fromPublic(temp.publicKey).getAddress('base58', network));
}

// Function creates an object of 20 BCH addresses from Master Public Key
function addressCollection () {
    let addressObject = {}
    let temp;
    for(let i = 0; i < 20; i++) {
        //derive child key from index value = to iteration value and temporarily hold in variable
        temp = hdkey.derive(i, false);
        //add key name to object with number equal to iterator + 1; add address obtained derived key in temp variable
        addressObject[`Address ${i + 1}`] = KeyRing.fromPublic(temp.publicKey).getAddress('base58', network)
    }
    return addressObject;
}


console.log('Extended Public Key:', xpubKey);
console.log('Private key of child:', child.privateKey);
console.log(`BCH Address Array: ${addressArray}`);

console.log(`BCH Address Object: `, addressCollection());











