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

    it('set new Listing price', async () => {
        const market = await Market.deployed();
        await market.setListingPrice("10000000000000000", {from: accounts[0]}); // 0.01 ether
        let listingPrice = await market.getListingPrice();
        assert.equal(listingPrice, 10000000000000000);
    });

    it('create Donation Item', async () => {
        const market = await Market.deployed();
        const nft = await NFT.deployed();

        const orgAddress = accounts[0];
        const minter = accounts[1];

        await market.addOrganization(orgAddress, "Milal")
        let listingPrice = await market.getListingPrice();
        listingPrice = listingPrice.toNumber();
        //listingPrice = web3.utils.fromWei(listingPrice, "ether")
        await nft.createToken("URL", {from: minter})
        await nft.createToken("URL", {from: minter})
        await market.createMarketItem(nft.address, 0, 1,orgAddress, {from: minter, value: listingPrice})
        await market.createMarketItem(nft.address, 1, 1,orgAddress, {from: minter, value: listingPrice})
        assert.equal(5000000000000000, listingPrice); // 0.005 ether
    });

    it('create market sale(sell nft!)', async () => {
        
    };

})