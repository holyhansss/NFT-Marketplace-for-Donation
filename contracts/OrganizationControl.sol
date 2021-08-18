// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrganizationControl is Ownable{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Organization{
        uint256 id;
        address orgAddress;
        string name;
        bool exist;
    }

    event newOrgCreated(uint256 id, address _orgAddress, string _orgName);
    event orgDeleted(uint256 id, address _orgAddress, string _orgName);

    mapping(uint256 => Organization) public orgainzations;
    
    uint256 public orgNumCount;
    
    modifier onlyToOrganization(uint256 _orgId){
        require(orgainzations[_orgId].exist);
        _;
    }
    
    function addOrganization(address _orgAddress, string memory _orgName) public onlyOwner{
        uint256 newtokenId = _tokenIds.current();
        orgainzations[newtokenId] = Organization(orgNumCount, _orgAddress, _orgName, true);
        emit newOrgCreated(orgNumCount, _orgAddress, _orgName);
        orgNumCount++;
        _tokenIds.increment();
        
    }
    
    function deleteOrgainzation(uint256 _tokenId) public onlyOwner{
        require(orgainzations[_tokenId].exist,"This orgization does not exist");
        emit newOrgCreated(_tokenId, orgainzations[_tokenId].orgAddress, orgainzations[_tokenId].name);
        delete orgainzations[_tokenId];
        orgNumCount--;
    }
    
    function getOrgAddressById(uint256 _tokenId) public view returns(address){
        return orgainzations[_tokenId].orgAddress;
    }
    function fetchOrgs() public {

    }

}