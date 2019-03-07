const assert = require('assert');
const ganache = require('ganache-cli'); // ** creates 10 accounts
const provider = ganache.provider();
const Web3 = require('web3'); // Web3 constructor
const web3 = new Web3(provider); // web3 instance

const compiledFactory = require('../ethereum/build/PostFactory.json');
const compiledPost = require('../ethereum/build/Post.json');

// List of accounts that exists on the local ganache network
let accounts;
// Reference to the deployed instance of the factory
let factory;
// An instance of a post
let post;
// The address of the post to test
let postAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    // Deploy an instance of the factory contract:
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

    factory.setProvider(provider);

    let d = new Date();
    let month = d.getMonth()+1;

    await factory.methods
    .createPost('Content', d.getDate(), month, d.getFullYear(), 773213)
    .send({
        from: accounts[0],
        gas: '1000000'
    });

    // Note the ES6 use -> [postAddress] means the await will return an array and I want to assign the first element to contract address.
    [postAddress] = await factory.methods.getDeployedPosts().call(); // returns an array of posts addresses

    // Create an instance of the post
    post = await new web3.eth.Contract(
        JSON.parse(compiledPost.interface),
        postAddress
    );

});

describe('Posts', () => {
    it('deploys a factory and a post', () => {
        assert.ok(factory.options.address);
        assert.ok(post.options.address);
    });

    it('marks caller as the post manager', async () => {
        const manager = await post.methods.manager().call();
        assert.equal(accounts[0], manager);
    });


    //TODO: Add more tests
    // Test the likePost function
    // Test the getSummary function
    // End to end test

});