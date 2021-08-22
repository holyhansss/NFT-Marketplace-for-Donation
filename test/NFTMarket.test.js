const Market = artifacts.require('NFTMarket');
const NFT = artifacts.require('NFT');

contract('NFT Market', async (accounts) => {
    it('Should be add organization correctly', async () => {
        const orgAddress = accounts[0];
        const market = await Market.deployed();
        await market.addOrganization(orgAddress, "Milal")
        const b = await market.getOrgAddressById(0)
        assert.equal(orgAddress, b);
    });
    
    it.only('create Donation Item', async () => {
        
        const market = await Market.deployed();
        const nft = await NFT.deployed();

        const orgAddress = accounts[0];
        const minter = accounts[1];

        await market.addOrganization(orgAddress, "Milal")
        let listingPrice = await market.getListingPrice();
        listingPrice = listingPrice.toString();
        listingPrice = web3.utils.fromWei(listingPrice, "ether")
                

        assert.equal(0.005, listingPrice);
    });

})