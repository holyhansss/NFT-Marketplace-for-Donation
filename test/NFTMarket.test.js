const Market = artifacts.require('NFTMarket');
const NFT = artifacts.require('NFT');

contract('NFT Market', () => {
    it('Should be add org', async () => {
        const market = await Market.deployed();
        await market.addOrganization("0x0d3D56806fe6eeDe410Ea9722da9a6f65FD24799", "Malie")
        const b = await market.getOrgAddressById(0)
        assert.equal(b, "0x0d3D56806fe6eeDe410Ea9722da9a6f65FD24799");
    });
    
    it('create Donation Item', async () => {
        const market = await Market.deployed();
        const nft = await NFT.deployed();
        await market.addOrganization("0x0d3D56806fe6eeDe410Ea9722da9a6f65FD24799", "Malie")
        let price = await market.getListingPrice({from: "0x0d3D56806fe6eeDe410Ea9722da9a6f65FD24799"});
        console.log(web3.utils.toWei(price, "ether"));
        //await NFT.createToken('URL');
        console.log(nft.address)
        //await market.createMarketItem(NFT.address, 0, 1, "0x0d3D56806fe6eeDe410Ea9722da9a6f65FD24799", {from: "0x0d3D56806fe6eeDe410Ea9722da9a6f65FD24789", value: price} )
        //const b = await market.getOrgAddressById(0)
        assert.equal(1,1);
    });

})