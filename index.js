

var bcash = require("bcash");
var axios = require("axios");




// Establish bitcoin cash seed phrase
var mnemonic = new bcash.Mnemonic("vacant shiver similar power oil real riot food field grow mind wet");

// Convert seed phrase to String
var seedPhrase = mnemonic.toString();
// convert phrase string to Array
// var phraseArray = seedPhrase.split(" ");
// // convert seed array back to String while removing commas
// var rePhrase = phraseArray.join(' ');

// // console.log("Array: ", phraseArray);
// var firstLetterArray = [];
// var letterObject = { totalLetters: 0 };

// for(let i = 0; i < phraseArray.length; i++) {
//     let word = phraseArray[i]; //word will equal the current word in the iteration
//     firstLetterArray.push(word[0]); //pushes the first letter of each word to an array
//      console.log('word ' + i, word);
//      letterObject.totalLetters = letterObject.totalLetters + word.length; //totals all letters in all words and stores it to letterObject totalLetters key/val pair
//      letterObject[word] = word.length; //creates a property for every word and assigns the length of each word as a value
    
// }


// console.log('firstLetterArray', firstLetterArray);
// console.log('letterObject', letterObject);

var master = bcash.hd.fromMnemonic(mnemonic); 
var hdkey = master.derivePath("m/44'/145'/0'/0");
var xpubKey  = hdkey.xpubkey();
var child = hdkey.derive(3, true);



console.log('Extended Public Key:', xpubKey);
console.log('Private key of child:', child.privateKey);






