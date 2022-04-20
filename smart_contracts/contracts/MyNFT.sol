// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract FireMen is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Dict to keep track of which URIs have already been minted
    mapping(string => uint8) existingURIs;

    // Dict to track each NFT's minting ID by name
    mapping(string => uint256) tokenName2Id;

    // Address of the Marketplace smart contract
    address marketAddress;

    // Token name & symbol
    constructor(address _marketAddress) ERC721("FireMen", "FIRE") {
        marketAddress = _marketAddress;
    }

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
        string memory metadataURI,
        string memory tokenName
    ) public payable returns (uint256) {

        // console.log("Addr %s attempting to mint NFT with %s ETH", recipient, msg.value);

        // If statement to check if URI has been minted already
        require(existingURIs[metadataURI] != 1, 'NFT already minted ;(');

        // Check if user paid enough ether
        require(msg.value >= 0.05 ether, 'Pay up, bitch! 0.05 ETH');

        // Creating new item id
        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Set the URI to 1: means it has been minted (true)
        existingURIs[metadataURI] = 1;

        // Tracking the token's TokenID
        tokenName2Id[tokenName] = newItemId;

        // Minting the NFT
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataURI);


        // Hardhat debug logs
        // string memory newTokenURI = tokenURI(newItemId);
        // console.log('User @ %s has minted the NFT @ %s', recipient, newTokenURI);

        return newItemId;
    }

    // How many tokens have been minted
    function tokenCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Fetch a token by name
    function getTokenIdByName(string memory name) public view returns (uint256) {
        // console.log('Name: %s | Id: %s', name, tokenName2Id[name]);
        return tokenName2Id[name];
    }

    // Get an NFT's owner by the token name
    function getOwnerByName(string memory name) public view returns (address) {
        uint256 tokenId = tokenName2Id[name];
        address owner = ownerOf(tokenId);

        return owner;
    }

    // Get the ether balance of this contract
    function getContractBalance() public view returns (uint256) {
        uint256 balance = address(this).balance;
        // console.log('This Contract has received %s WEI', balance);

        return balance;
    }


    // Send revenue ether to the contract owner
    function cashOut() public payable onlyOwner {
        uint256 balance = getContractBalance();
        require(balance > 0, 'No ether to cash out ;(');
        
        payable(owner()).transfer(balance);

        // console.log('Transferred %s GWEI to addr: %s', (balance/10**9), _owner);
    }


    // Transfer token to another address
    function transferToken(address to, uint256 tokenId) public {
        safeTransferFrom(msg.sender, to, tokenId);
    }


    // Gets all NFTs owned by the sender's address
    function getMyTokens() public view returns (string[] memory) {
        uint totalCount = _tokenIdCounter.current();
        uint myCount = 0;
        uint currentIndex = 0;

        // looping over the mapping to find how many tokens are owned by this address
        for (uint256 index = 0; index < totalCount; index++) {
            if(ownerOf(index) == msg.sender) {
                myCount += 1;
            }
        }

        // creating an array with length equal to the user's item count
        string[] memory myTokens = new string[](myCount);

        // now actually getting that address' tokens
        for (uint256 i = 0; i < totalCount; i++) {
            if (ownerOf(i) == msg.sender) {
                myTokens[currentIndex] = tokenURI(i);
                currentIndex += 1;
            }
        }

        return myTokens;
    }


    // Gving the Marketplace contract approval to transfer the Token
    function approveMarket(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Only the NFT's owner can approve this!");
        approve(marketAddress, tokenId);
    }

    // Removing approval once no longer needed
    function revokeApproval(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Only the NFT's owner can approve this!");
        approve(address(0), tokenId);
    }
}
