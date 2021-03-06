// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";  // prevents re-entry attacks when communicating with another contract
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

// https://www.youtube.com/watch?v=GKJBEEXUha0

contract NFTMarket is ERC721, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Counting all items sold for array reasons
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsForSale;

    // The Owner of the marketplace ( me :) )
    address payable owner;

    // Fee to put up items for sale on the market
    uint256 listingFee = 0 ether;

    // Commision charged by the marketplace owner ( me :) )
    uint256 marketCommission = 5; // percentage

    // Mapping of TokenId to marketItemId
    mapping (uint256 => uint256) tokenId2itemId;


    // Object holding all the needed info about an NFT on the market
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // Tracking all the MarketItems that have been created 
    mapping(uint256 => MarketItem) private id2MarketItem;

    // Event fired whenever a new market item is created (The indexed parameters for logged events will allow you to search for these events using the indexed parameters as filters.)
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold
    );


    // Constructor - the owner of the market contract is the address deploying it
    constructor() ERC721("Firemen Marketplace", "FMART") {
        owner = payable(msg.sender);
    }


    ///// OWNER-ONLY
    // Allow the owner to update the listing price
    function updateListingFee(uint newListingFee) public payable {
        require(owner == msg.sender, "Only marketplace owner can update listing price.");
        listingFee = newListingFee;
    }

    // Allow the owner to update the market commission fee
    function updateCommissionFee(uint newCommissionFee) public payable {
        require(owner == msg.sender, "Only marketplace owner can update the market commission.");
        marketCommission = newCommissionFee / 100; // percentage
    }
    ////////


    ///// PUBLIC FUNCTIONS
    // Putting up a token for sale
    function createMarketItem(
        address nftContract,
        uint tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingFee, "You must pay the fee to list an item for sale :)");

        console.log(">>> Creating market item for NFT #%s", tokenId);

        uint256 newItemId = _itemIds.current();
        _itemIds.increment();
        _itemsForSale.increment();
        tokenId2itemId[tokenId] = newItemId;

        // Creating a new MarketItem and saving it to the mapping
        MarketItem memory newMarketItem = MarketItem(
            newItemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        id2MarketItem[newItemId] = newMarketItem;
        console.log("Addr %s listed NFT #%s from contract %s", newMarketItem.seller, newMarketItem.tokenId, newMarketItem.nftContract);
        console.log("\t... for %s ETH", newMarketItem.price / 10**18);

        // Transfer ownership of the NFT from the seller to smart contract itself (using the transferFrom function in the given contract)
        // so that the contract can automatically transfer it to the buyers
        IERC721(nftContract).transferFrom(
            msg.sender,     // transfer FROM this address
            address(this),  // transfer TO this address
            tokenId         // transfer token with this id
        );       

        // Emit the event
        emit MarketItemCreated(newItemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price, false);
    }


    // Cancel the listing, and return the NFT to the seller's address
    function removeMarketItem(
        // address nftContract,
        uint tokenId
    ) public nonReentrant {
        uint256 itemId = getItemId(tokenId);
        console.log("item ID: %s", itemId);

        MarketItem memory item = id2MarketItem[itemId];
        require(msg.sender == item.seller, "Only the seller can withdraw the listing :)");

        // one less item for sale
        _itemsForSale.decrement();
        id2MarketItem[itemId] = MarketItem(0, address(0), 0, payable(address(0)), payable(address(0)), 0, false);

        // transfer ownership of the token back to the seller
        IERC721(item.nftContract).transferFrom(address(this), msg.sender, tokenId);
    }


    // Puchasing an NFT item from the market
    function purchaseMarketItem(
        address nftContract,
        uint itemId
    ) public payable nonReentrant {
        uint price = id2MarketItem[itemId].price;
        uint tokenId = id2MarketItem[itemId].tokenId;

        console.log("Tx value: %s", msg.value);
        console.log("Item price: %s", price);

        require(msg.value == price, "Transaction value must equal the item's price");

        uint256 commissionFee = msg.value * ( marketCommission / 100 );

        // transfering the tx value to the seller
        id2MarketItem[itemId].seller.transfer(msg.value - commissionFee);

        // transfer ownership of the token to the buyer from the smart contract
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        // paying the commission to the owner
        payable(owner).transfer(commissionFee);

        // stuff
        id2MarketItem[itemId].owner = payable(msg.sender);
        id2MarketItem[itemId].sold = true;
        _itemsSold.increment();
        _itemsForSale.decrement();
    }


    //// VIEW FUNCTIONS
    // Gets a MarketItem ID using the NFT's token ID
    function getItemId(uint256 tokenId) public view returns (uint256) {
        return tokenId2itemId[tokenId];
    }
    
    // Count of how many items have been purchased on the market place
    function getItemsSold() public view returns (uint256) {
        return _itemsSold.current();
    }

    // Count for how many items are currently up for sale
    function getItemsForSale() public view returns (uint256) {
        return _itemsForSale.current();
    }


    // Fetching all items currently for sale
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint itemsForSale = _itemsForSale.current();
        console.log("itemsForSale: %s", itemsForSale);
        
        // looping over an array to find every unsold item
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemsForSale);

        for (uint i = 0; i < itemCount; i++) {
            // Check if the item has an owner
            console.log("NFT #%s | Item ID #%s | Owner: %s",
                id2MarketItem[i].tokenId,
                id2MarketItem[i].itemId,
                id2MarketItem[i].owner);
            if (id2MarketItem[i].owner == address(this) && id2MarketItem[i].sold == false) {
                uint id = id2MarketItem[i].itemId;
                MarketItem storage currentItem = id2MarketItem[id];

                // appending it to the array
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        // return the list of items for sale
        return items;
    }

    // Fetching all items owned by an address
    function fetchMyTokens() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint myCount = 0;
        uint currentIndex = 0;

        // looping over an array to find every item belonging to this address to find the owned count
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (id2MarketItem[i].owner == msg.sender) {
                myCount += 1;
            }
        }

        // creating an array with length equal to the user's item count
        MarketItem[] memory myItems = new MarketItem[](myCount);

        // now actually getting that address' tokens
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (id2MarketItem[i].owner == msg.sender) {
                uint id = id2MarketItem[i].itemId;
                MarketItem storage currentItem = id2MarketItem[id];

                myItems[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        // Return the array
        return myItems;
    }

    // Fetch all listings by this user
    function fetchMyItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        // looping over an array to find every item being sold by this address
        for (uint i = 0; i < totalItemCount; i++) {
            if (id2MarketItem[i].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // creating an array with length equal to the user's item count
        MarketItem[] memory items = new MarketItem[](itemCount);

        // now actually getting that user's listings
        for (uint i = 0; i < totalItemCount; i++) {
            if (id2MarketItem[i].seller == msg.sender) {
                uint currentId = i;
                MarketItem storage currentItem = id2MarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


    // NFTs created by this user
    // function fetchItemsCreated() public view returns (MarketItem[] memory) {
    //     uint totalItemCount = _itemIds.current();
    //     uint myCount = 0;
    //     uint currentIndex = 0;
    // }
}