require('dotenv').config({ path: '../.env'}); // Keep the private data in a dotenv file.
import Web3 from 'web3'; // Web3 with capital W is the constructor.

// New instance of Web3 with the provider that is automatically provided to us by MetaMask inside the browser.
// This makes the assumption that the user has MetaMask.
let web3;

// if - We execute inside the browser and MetaMask is available
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    // We are on the server *OR* the user is not running MetaMask.
    // Create our own provider:
    const provider = new Web3.providers.HttpProvider(
        // Pass the URL of some remote node that we have excess to (such as Infura node).
        'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY
    );
    web3 = new Web3(provider);
}

export default web3;