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

    it.only('create market sale(sell nft!)', async () => {
        const market = await Market.deployed();
        const nft = await NFT.deployed();

        const owner = accounts[0]; // deployer 
        const orgAddress = accounts[5];
        const minter = accounts[6];
        const buyer = accounts[7];

        console.log("owner: " + owner)
        console.log("orgAddress: " + orgAddress)
        console.log("minter: " + minter)
        console.log("buyer: " + buyer)
        console.log("nft Address: " + nft.address)
        console.log("nftMarket Address: " + market.address)

        let listingPrice = await market.getListingPrice();
        listingPrice = listingPrice.toNumber();
        //create token and market item
        await nft.createToken("SOME URL", {from: minter})
        await market.createMarketItem(nft.address, 0, "5000000000000000000", orgAddress, {from: minter, value: listingPrice})
        let minterPriceBeforeCreateSale = await web3.eth.getBalance(minter);

        // create market sale
        await market.createMarketSale(nft.address, 0, {from: buyer, value: "5000000000000000000"});

        const orgPriceInWei = await web3.eth.getBalance(orgAddress)
        const minterPriceInWei = await web3.eth.getBalance(minter)

        assert.equal(Number(minterPriceBeforeCreateSale) + 500000000000000000, minterPriceInWei) // earn 10% of item price
        assert.equal(orgPriceInWei, 104500000000000000000) // get 100 ethers when deployed, and 90% of price 
        
        //check token has transfered correctly
        tokenOwner = await nft.ownerOf(0, {from: buyer});
        assert.equal(tokenOwner, buyer)
    });

})