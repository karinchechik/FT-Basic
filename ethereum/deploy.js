require('dotenv').config({ path: '../.env'}); // specify the path to the .env file if deploy.js and .env are not in the same directory.

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/PostFactory.json');

// set up the HD wallet provider.
// specify the ether account and the node to connect to.
const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY
);

const web3 = new Web3(provider);

const deploy = async () => {
    // Get a list of all the accounts that have been unlocked through the wallet provider.
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    // Contract deployment statement.
    // result is an instance of the contract.
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas:'1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
};
deploy();
