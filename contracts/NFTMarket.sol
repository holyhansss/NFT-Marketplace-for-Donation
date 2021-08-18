// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarket is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsOnSale;
    Counters.Counter private _OrgIds;

    uint256 private listingPrice = 0.005 ether;

    // define DonationItem struct
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable owner;
        uint256 price;
        bool sold;
        address payable donateTo;
    }
    // define Organization struct
    struct Organization{
        uint256 id;
        address orgAddress;
        string name;
    }

    // map item token id to Donation Item
    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => Organization) private idToOrgainzations;

    //event when New Dontation Item is created
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner,
        uint256 price,
        bool sold
    );
    //event when new Organizaion is created
    event newOrgCreated(
        uint256 id, 
        address _orgAddress, 
        string _orgName
        );
    //event when exist organization is deleted
    event orgDeleted(
        uint256 id, 
        address _orgAddress, 
        string _orgName
    );
    // add an Organization 
    function addOrganization(address _orgAddress, string memory _orgName) public onlyOwner{
        uint256 newTokenId = _OrgIds.current();
        idToOrgainzations[newTokenId] = Organization(newTokenId, _orgAddress, _orgName);
        emit newOrgCreated(newTokenId, _orgAddress, _orgName);
        _OrgIds.increment();
    }
    //delete an Organization
    function deleteOrgainzation(uint256 _tokenId) public onlyOwner{
        //require(idToOrgainzations[_tokenId],"This orgization does not exist");
        emit newOrgCreated(_tokenId, idToOrgainzations[_tokenId].orgAddress, idToOrgainzations[_tokenId].name);
        delete idToOrgainzations[_tokenId];
        
    }
    //get Organization address by id
    function getOrgAddressById(uint256 _tokenId) public view returns(address){
        return idToOrgainzations[_tokenId].orgAddress;
    }
////////////////////////////////////////////////////////////////////////////////////////////////
    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
    // Setting New Listing Price around 1500 won
    function setLIstingPrice(uint _newListingPrice) public onlyOwner {
        listingPrice = _newListingPrice;
    }
    // Creating a new Donation Item
    function createMarketItem(
        address nftContract, 
        uint256 tokenId, 
        uint256 price,
        address _donateToWho   
    ) public payable nonReentrant {
        require(price > 0, "Price must be higher than 0 wei");
        //require(msg.value == listingPrice,"Price mush be equal to list price");
        
        uint256 itemId = _itemIds.current();
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            price,
            false,
            payable(_donateToWho)
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        _itemIds.increment();
        payable(owner()).transfer(msg.value);
        emit MarketItemCreated(
            itemId, 
            nftContract, 
            tokenId, 
            msg.sender, 
            price, 
            false
        );
    }

    //Sell Item
    function createMarketSale(
        address nftContract, 
        uint256 _itemId
    ) public payable nonReentrant {
        //get item Price
        uint price = idToMarketItem[_itemId].price;
        //get item Id
        uint tokenId = idToMarketItem[_itemId].tokenId;
        //check Item price is equal to mag.value
        require(msg.value == price,"does not equal to price");
        //calculate ethers to owner
        uint priceToOwner = (msg.value)/10 * 1;
        //calculate ethers to Org
        uint priceToOrg = ((msg.value)/10) * 9;
        //send ethers to owner and donated Org
        idToMarketItem[_itemId].owner.transfer(priceToOwner);
        idToMarketItem[_itemId].donateTo.transfer(priceToOrg);
        //change the ownership of token to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[_itemId].owner = payable(msg.sender);
        idToMarketItem[_itemId].sold = true;
        _itemsSold.increment();
        //payable(owner).transfer(listingPrice);
    }

    //fetch marketItem for frontEnd
    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemsOnSale.current() - _itemsSold.current();
        uint currentIndex = 0;
        
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint i=0;i<itemCount;i++){
            if(idToMarketItem[i].owner == msg.sender && idToMarketItem[i].sold == false){
                uint currentId = idToMarketItem[i].itemId;
                MarketItem storage currentItem = idToMarketItem [currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        for(uint i = 0; i<totalItemCount; i++){
            if(idToMarketItem[i].owner == msg.sender){
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i = 0; i<totalItemCount; i++){
            if(idToMarketItem[i].owner == msg.sender){
                uint currentId = idToMarketItem[i].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }



    
}