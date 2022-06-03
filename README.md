# [nft.currencything.com](http://nft.currencything.com/) 🔥
![banner](https://i.imgur.com/YnidaNH.png)
This is a testnet NFT marketplace where you can mint fun Firemen, gift them to yours friends, and buy/sell them on the market.

## Main features

 - Displays entire NFT collection
 - Shows the owner addresses of all minted NFTs
 - Users can freely choose which Fireman they want to mint, but their stats are secret until you mint them
 - NFTs can be gifted to anyone
 - Market allows you buy NFTs from other users or put your own up for sale
 - You can freely remove your unsold NFTs from the market at any time

![Firement NFT Collection](https://i.imgur.com/GMPM1kD.png)

## Why I made this
This was the first Web3 and Smart Contracts project I made. I wanted to learn how Web3 Dapps are made and how they interact with the Ethereum blockchain through wallets like MetaMask and through Smart Contracts.

I also wanted to understand how NFTs actually work behind the scenes, so I decided to learn all the basics of Solidity, Ethereum's programming language. After that, I was able comfortable with making my own Smart Contracts.

Additionally, I wanted to become more familiar with the IPFS file protocol and have experience using it.

![Your Firemen Profile](https://i.imgur.com/lY2eiaT.gif)

## How it works
The "backend" of this website is made up of two smart contracts: the `MyNFT` and `NFTMarket` contracts.

**MyNFT** contains all the data and functions required to fullfil the ERC721 standard. It stores the base URI of the IPFS directory, which NFTs have already been minted, the owner of the contract, and the address of the NFTMarket contract. It allows users to: pay to mint an available NFT and send it to them, transfer the NFT to any address they want, and to approve the NFTMarket selling an NFT on their behalf. For the contract owner, there is the `cashOut` function that transfers all the proceeds from minting to the owner's address.

**NFTMarket** is what lets users buy and sell their Firemen NFTs. With `createMarketItem`, you set a sale price and transfer ownership of the NFT to the Market. The contract keeps track of all market items and their owners, so the original owner can remove their NFT from the market and return it to their own wallet at any time. With `purchaseMarketItem`, users can buy any NFT on the market if the amount of ether sent is equal to the market item's sale price. In which case, ownership of the NFT will be transfered to them, and the sale proceeds will go to the seller's address.

The **frontend** was made in SvelteKit and is mostly pretty standard. Some of the Web3-specific demands included creating constants to contain all the network variables and ethereum objects, like the provider and signer, and loading the Smart Contract's ABI as JSON files in order to be able to interact with them. I had to create a wallet connect button to allow a user to "sign in" with their ethereum address and authorise transactions through a wallet like Metamask. One of the challenges here was not hardcoding anything ethereum/metamask related, to account for the fact that some users might not have a browser wallet installed yet, and I didn't want that to break the entire website.

![The Marketplace](https://i.imgur.com/XleC4Cz.gif)

## Impressed? Need someone like me?
Offer me a job :)
sebastiancc.info@gmail.com

or check out the rest of my projects on [my personal website](https://sam.freelancepolice.org/).

![me :)](https://sam.freelancepolice.org/static/images/photo.webp)



