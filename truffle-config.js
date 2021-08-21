const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require('fs')
//const MNEMONIC = fs.readFileSync(".secret").toString().trim();
//const infuraKey = 'cccb4f7a4e134dcfb4e72c8874e2bde7'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
    },
    //ropsten: {
    ////  provider: function() {
    //    return new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/${infuraKey}`)
   //   },
    //  network_id: 3,
    //  gas: 4000000,    //make sure this gas allocation isn't over 4M, which is the max

    //}
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
