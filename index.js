

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

let master = bcash.hd.fromMnemonic(mnemonic); 
let hdkey = master.derivePath("m/44'/145'/0/0'");
let xpubKey  = hdkey.xpubkey();//Derive Extended public key
let child = hdkey.derive(0, false);//Derive a child key from master key
let keyRing = KeyRing.fromPublic(child.publicKey);
let bchAddress = keyRing.getAddress('string', network);//create address from public key
let grandChildKey1 = child.derive(0);// child key derived from child from higher depth
let address1 = KeyRing.fromPrivate(grandChildKey1.privateKey).getAddress('string');//segwit address from grandChildKey1
let hdWallet = {};
// Function creates an object of 20 BCH addresses from Master Public Key
function addressCollection () {
    let addressObject = {}
    let temp;
    for(let i = 0; i < 20; i++) {
        //derive child key from index value = to iteration value and temporarily hold in variable
        temp = hdkey.derive(i, false);
        //add key name to object with number equal to iterator + 1; add address obtained derived key in temp variable
        addressObject[`Address ${i + 1}`] = KeyRing.fromPublic(temp.publicKey).getAddress('string');
    }
    return addressObject;
}




// Function queries a BCH node and derives UTXO data of a particular address 
// then creates a Coin object with data, then creates a transaction and broadcasts it to BCH node
async function CoinTx() {
     try {
        const result = await axios.get(`https://bcash.badger.cash:8332/coin/address/${address1}`);
        const utxos = result.data
        const firstUTXO = utxos[0];
        const UTXOArray = [];
        let coin;
        // Create array of UTXOS from address
        for(let i = 0; i < utxos.length; i++) {
            coin = new Coin().fromJSON(utxos[i]);
            UTXOArray.push(coin);
        }
        // const coin = new Coin().fromJSON(firstUTXO);
        // Create Coin object from first UTXO
        const firstCoin = new Coin({
            version: firstUTXO.version,
            height: firstUTXO.height,
            value: firstUTXO.value,
            script : Buffer.from(firstUTXO.script, "hex"), 
            coinbase: firstUTXO.coinbase,
            hash: Buffer.from(firstUTXO.hash, "hex").reverse(),// to go the other way firstTrans.hash.toString('hex)
            index: firstUTXO.index,
           
        }); 
        
        console.log(firstUTXO.address);

        // Create new transaction
        const tx = new bcash.MTX();
        // Address output and amount of funds being sent
        tx.addOutput({
            address: address1,
            value: null
        });

        // UTXO being used in transaction, address for any returned change as well as rate(fee)for transaction
        await tx.fund([firstCoin], {
            changeAddress: createKeyRingArray()[1].getKeyAddress('string'),
            rate: null
        });
        // signs transaction with keyring
        tx.sign(createKeyRingArray());

        console.log('tx', tx);
        console.log('raw tx hex', tx.toRaw().toString('hex'));
        // broadcasts transaction to BCH node
        const broadcastResult  = axios.post('https://bcash.badger.cash:8332/broadcast', {
            tx: tx.toRaw().toString('hex')
        })
        
        console.log('broadcastResult.Data', broadcastResult.data);
    } catch (error) {
        console.error(error);
    }
                  
};
//Function creates an array of KeyRing objects from Private child key of child key
function createKeyRingArray() {
    const keyRingArray = [];
    for(let i = 0; i < 19; i++) {
    const grandChild = child.derive(i);
    const myKeyRing = KeyRing.fromPrivate(grandChild.privateKey);
    keyRingArray.push(myKeyRing);
    }
    return keyRingArray;
};
//Function to get addresses from KeyRing
function getAddress(arr) {
    //Saves the keyring array to variable
    let keyRing = arr;
    //derives addresses from keyring object and maps them to new array
    let addressArray = keyRing.map(keyRing => keyRing.getAddress('string'));
    //calls the getUTXOS function on each address in the array and returns the data
    return addressArray;
}
//Function accepts an array of addresses and returns an array of address objects
function createAddressObject (arr) {
    let addressArray = [];
    for(let i = 0; i < arr.length; i++) {
       //add key name to object with number equal to iterator + 1; add address obtained derived key in temp variable
       addressArray.push({address: arr[i].getAddress('string'), UTXOS: null});
       
    }
    return addressArray;
}


let ringArray = createKeyRingArray();
let addArray = getAddress(ringArray);
hdWallet = createAddressObject(ringArray);





//Function queries node with BCH address argument
async function getUTXOS(address) {
    
    try {
        // GET request to node
        const result = await axios.get(`https://bcash.badger.cash:8332/coin/address/${address}`);
        // saves the returned data
        const utxos = result.data;
        const UTXOArray = [];
        let coin;
        for(let i = 0; i < utxos.length; i++) {
            coin = new Coin().fromJSON(utxos[i]);
            UTXOArray.push(coin);
            
        }
        return console.log(UTXOArray);
    }   
    catch (error) {
        console.error(error);
    }
};




async function queryMultiAddress(arr) {
    let reqArr = [];
    let temp;
    
    for(let i = 0; i < arr.length; i++) {
        temp = axios.get(`https://bcash.badger.cash:8332/coin/address/${arr[i]}`);
        reqArr.push(temp);
    };

    const res = await Promise.all(reqArr)
    const data = res.map((res)=> res.data);
    // const firstUTXO = data[0][0].address;
    return data;
;}


queryMultiAddress(addArray).then(data => {
    hdWallet.map((key) => {
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < data[i].length; j++) {
                // console.log(data[i][j].address);
                if(data[i][j].address === key.address) {
                    key.UTXOS = new Coin().fromJSON(data[i][j]);
                }  
            }    
        }
        return hdWallet;
    })
    console.log(hdWallet);
})



















