// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract nftcontract is ERC721, Ownable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (uint256 => uint256) public tokenRarity;


    event MintNFT(uint256 tokenId, address recipient, uint256 tokenRarity);

    string private _baseURIextended;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function vrf() public view returns (bytes32 result) {
        uint[1] memory bn;
        bn[0] = block.number;
        assembly {
        let memPtr := mload(0x40)
        if iszero(staticcall(not(0), 0xff, bn, 0x20, memPtr, 0x20)) {
            invalid()
        }
        result := mload(memPtr)
        }
    }

    function randomBySender() public view returns (uint256){
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, vrf())));
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    function mintNFT(address recipient)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        uint num = randomBySender();
        tokenRarity[newItemId] = num % 10;
       // mintWithTokenURI(recipient, newItemId, tokenURI);
        _mint(recipient, newItemId);
        emit MintNFT(newItemId,recipient,tokenRarity[newItemId]);
        return newItemId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
}
