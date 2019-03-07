const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [
        new Dotenv({systemvars: true})
        /*new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.MNEMONIC': JSON.stringify(process.env.MNEMONIC),
            'process.env.INFURA_API_KEY': JSON.stringify(process.env.INFURA_API_KEY),
            'process.env.ADDRESS': JSON.stringify(process.env.ADDRESS),
            'process.env.API_TOKEN': JSON.stringify(process.env.API_TOKEN)
        })*/
    ]
};