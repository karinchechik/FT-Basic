// Import different modules:
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Delete the entire 'build' folder if exists.
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// Read 'Post.sol' from the 'contracts' folder
const postPath = path.resolve(__dirname, 'contracts', 'Post.sol');
const source = fs.readFileSync(postPath, 'utf8');

// Compile both contracts with solidity compiler
const output = solc.compile(source, 1).contracts; // 2 outputs (post and postFactory).

// Write output to the 'build' directory
fs.ensureDirSync(buildPath); // Recreate the build folder is doesn't exist.

// Loop over the outputs and write it to different files in the build directory
for (let contract in output) {
    fs.outputJsonSync( path.resolve(buildPath, contract.replace(':', '') + '.json' ), output[contract] );
}