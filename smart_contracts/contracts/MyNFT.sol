// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FireMen is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Dict to keep track of which URIs have already been minted
    mapping(string => uint8) existingURIs;

    // Token name & symbol
    constructor() ERC721("FireMen", "FIRE") {}

    // Base protocol of the link (http, https, or ipfs)
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    // This function only allows the contract owner to mint NFTs
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    //////// My functions

    // Check if NFT is already owned
    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    // Allow anyone to mint a new NFT if they have enough ETH
    function payToMint(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {

        // If statement to check if URI has been minted already
        require(existingURIs[metadataURI] != 1, 'NFT already minted ;(');

        // Check if user paid enough ether
        require(msg.value >= 0.05 ether, 'Pay up, bitch! 0.05 ETH');

        // Creating new item id
        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Set the URI to 1: means it has been minted (true)
        existingURIs[metadataURI] = 1;

        // Minting the NFT
        _mint(recipient, newItemId);

        return newItemId;
    }

    // How many tokens have been minted
    function tokenCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
