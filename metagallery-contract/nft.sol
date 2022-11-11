// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract nftcontract is ERC721, Ownable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _collectionIds;
    
    mapping (uint256 => string) public _tokenURIs;
    mapping (uint256 => string) public _tokenName;
    mapping (uint256 => uint256) public _collectionId;
    mapping (uint256 => string) public _collectionURIs;
    mapping (uint256 => uint256) public _collectionThemeId;
    mapping (uint256 => string) public _collectionName;
    mapping (uint256 => address) public _collectionOwner;
    mapping (uint256 => uint256) public _tokenPower;

    event MintNFT(uint256 tokenId, address recipient, string tokenURI,string name,uint256 collectionId_,uint256 tokenPower);
    event CreateCollection(uint256 collectionId,string collectionName,string collectionURIs,uint256 collectionThemeId,address collectionOwner);

    string private _baseURIextended;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    function mintNFT(address recipient, string memory tokenURI,string memory name,uint256 collectionId_,uint256 _power)
        public
        returns (uint256)
    {
        require (
            _collectionOwner[collectionId_] == msg.sender, 'not collection owner'
        );
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
       // mintWithTokenURI(recipient, newItemId, tokenURI);
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _setName(newItemId,name);
        _setPower(newItemId,_power);
        _collectionId[newItemId] = collectionId_; 
        emit MintNFT(newItemId,recipient,tokenURI,name,collectionId_,_power);
        return newItemId;
    }

    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(
            _exists(tokenId),
            'KIP17Metadata: URI set of nonexistent token'
        );
        _tokenURIs[tokenId] = uri;
    }

    function _setName(uint256 tokenId, string memory name) internal {
        require(
            _exists(tokenId),
            'KIP17Metadata: URI set of nonexistent token'
        );
        _tokenName[tokenId] = name;
    }

    function _setPower(uint256 tokenId,uint256 _power) internal {
        require(
            _exists(tokenId),
            'nft not exists'
        );
        _tokenPower[tokenId] = _power;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function createCollection(string memory collectionName_,string memory collectionURIs,uint256 collectionThemeId) public {
        _collectionIds.increment();
        uint256 newCollectionId = _collectionIds.current();
        _collectionName[newCollectionId] = collectionName_;
        _collectionOwner[newCollectionId] = msg.sender;
        _collectionThemeId[newCollectionId] = collectionThemeId;
        _collectionURIs[newCollectionId] = collectionURIs;
        emit CreateCollection(newCollectionId,collectionName_,collectionURIs,collectionThemeId,msg.sender);
    }

    function getPower (uint256 tokenId) public view returns(uint256) {
        return _tokenPower[tokenId];
    }

    function getCollectionId (uint256 tokenId) public view returns(uint256) {
        return _collectionId[tokenId];
    }

    function getCollectionOwner (uint256 tokenId) public view returns(address) {
        return _collectionOwner[tokenId];
    }
}
