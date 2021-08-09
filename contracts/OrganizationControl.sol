// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OrganizationControl is Ownable{
    
    constructor(){

    }
    struct Organization{
        uint256 id;
        address orgAddress;
        string name;
        uint totalValue;
        bool exist;
    }

    event newOrgCreated(uint256 id, address _orgAddress, string _orgName);
    event orgDeleted(uint256 id, address _orgAddress, string _orgName);

    mapping(uint256 => Organization) public orgainzations;
    
    uint8 public orgNumCount;
    uint256 public tokenIds;
    
    modifier onlyToOrganization(string memory _orgName){
        require(orgainzations[tokenIds].exist);
        _;
    }
    
    function addOrganization(address _orgAddress, string memory _orgName) public onlyOwner{
        orgainzations[tokenIds] = Organization(orgNumCount, _orgAddress, _orgName, 0, true);
        emit newOrgCreated(orgNumCount, _orgAddress, _orgName);
        orgNumCount++;
        tokenIds++;
        
    }
    
    function deleteOrgainzation(uint256 _tokenIds) public onlyOwner{
        require(orgainzations[_tokenIds].exist,"This orgization does not exist");
        emit newOrgCreated(_tokenIds, orgainzations[_tokenIds].orgAddress, orgainzations[_tokenIds].name);
        delete orgainzations[_tokenIds];
        orgNumCount--;
    }
    function getOrgAddressById(uint256 _tokenIds) public view returns(address){
        return orgainzations[_tokenIds].orgAddress;
    }


}