

var bcash = require("bcash");
var axios = require("axios");
const {Network, KeyRing, Coin} = require('bcash');
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


let master = bcash.hd.fromMnemonic(mnemonic); 
let hdkey = master.derivePath("m/44'/145'/0/0'");
let xpubKey  = hdkey.xpubkey();//Derive Extended public key
let child = hdkey.derive(0, false);//Derive a child key from master key
let keyRing = KeyRing.fromPublic(child.publicKey);
let bchAddress = keyRing.getAddress('string', network);//create address from public key
let grandChildKey1 = child.derive(0);// child key derived from child from higher depth
let address1 = KeyRing.fromPrivate(grandChildKey1.privateKey).getAddress('string');//segwit address from grandChildKey1


// Function creates an object of 20 BCH addresses from Master Public Key
function addressCollection () {
    let addressObject = {}
    let temp;
    for(let i = 0; i < 20; i++) {
        //derive child key from index value = to iteration value and temporarily hold in variable
        temp = hdkey.derive(i, false);
        //add key name to object with number equal to iterator + 1; add address obtained derived key in temp variable
        addressObject[`Address ${i + 1}`] = KeyRing.fromPublic(temp.publicKey).getAddress()
    }
    return addressObject;
}

const keyRingArray = [];
for(let i = 0; i < 19; i++) {
    const grandChild = child.derive(i);
    const keyRing2 = KeyRing.fromPrivate(grandChild.privateKey);
    keyRingArray.push(keyRing2);
}



(async function() {

    try {
        const result = await axios.get(`https://bcash.badger.cash:8332/coin/address/${address1}`);
        const utxos = result.data;
        
        console.log('utxos: ', utxos);
        
    } catch (error) {
        console.error(error);
    }
                  
})();

// console.log('Extended Public Key:', xpubKey);
// console.log('Private key of child:', child.privateKey);
// console.log(`BCH Address Array: ${addressArray}`);

// console.log(`BCH Address Object: `, addressCollection());

// console.log('Key Ring Array: ', keyRingArray.map(keyring => keyring.getKeyAddress('string')));











