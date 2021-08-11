var NFTMarket = artifacts.require("./NFTMarket");
var NFT = artifacts.require("./NFT");

module.exports = function(deployer) {  
  deployer.deploy(NFTMarket).then(function(){
    //  console.log(NFTMarket.address)
    return deployer.deploy(NFT, NFTMarket.address)});
};
