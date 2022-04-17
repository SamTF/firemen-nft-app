// Imports
const { expect } = require("chai");

describe("MyNFT Marketplace", function () {
    // Constants
    const metadataURI = 'QmeJMB9XBEYKtkuHsGzaJ2Ei9dqA9nb2tt7S3quX8q6rE9';
    const tokenName = '000';
    const addressZero = '0x0000000000000000000000000000000000000000';

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Deploying the market contract
        Market = await ethers.getContractFactory("NFTMarket");
        market = await Market.deploy();
        await market.deployed();

        // Deploying the NFT contract
        FireMen = await ethers.getContractFactory("FireMen");
        firemen = await FireMen.deploy(market.address);
        await firemen.deployed();

        // Addresses
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });


    describe("Deployment & Approving Marketplace", function () {
        it("Should approve the marketplace and revoke approval when requested by a user", async function () {
            console.log(market.address);
            console.log(firemen.address);

            // Minting a new NFT using addr1
            console.log('>>> Minting a new NFT')
            await firemen.connect(addr1)    // connect to address1's account
            const newlyMintedToken = await firemen.connect(addr1).payToMint(`${metadataURI}/${tokenName}.json`, tokenName, { value: ethers.utils.parseEther('0.05') });

            // Wait until the minting tx has been mined/confirmed
            await newlyMintedToken.wait();

            // Check who is approved to transfer that token
            let approved = await firemen.getApproved(0);
            expect(approved).to.equal(addressZero);

            // Set approval for the current token
            console.log('>>> Approving marketplace for current NFT');
            await firemen.connect(addr1).approveMarket(0);

            // Make sure the market address is now approved
            approved = await firemen.getApproved(0);
            expect(approved).to.equal(market.address);

            // Revoking the marketplace's approval
            console.log('>>> Revoking marketplace approval');
            await firemen.connect(addr1).revokeApproval(0);

            approved = await firemen.getApproved(0);
            expect(approved).to.equal(addressZero);
        });
    });

    describe.only("Selling an NFT on the market", function () {
        it("Should put a minted NFT for sale on the market", async function () {
            // Minting a new NFT using addr1
            await firemen.connect(addr1).payToMint(`${metadataURI}/${tokenName}.json`, tokenName, { value: ethers.utils.parseEther('0.05') });
            let balanceStart = parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(addr1.address)));
            
            // Creating a listing on the market (addr1)
            console.log('>>> Creating Market listing')
            const listingPrice = ethers.utils.parseEther('10')
            await firemen.connect(addr1).approveMarket(0);
            await market.connect(addr1).createMarketItem(firemen.address, 0, listingPrice); // this should work, since we connect to the nft owner's account

            // Purchasing the NFT (addr2)
            await market.connect(addr2).purchaseMarketItem(firemen.address, 0, {value : listingPrice})

            // Checking the new owner of the NFT
            expect(await firemen.isContentOwned(`${metadataURI}/${tokenName}.json`)).to.equal(true);
            let tokenOwner = await firemen.getOwnerByName(tokenName);
            expect(tokenOwner).to.equal(addr2.address)
            console.log(`>>> ${tokenOwner} owns NFT "${tokenName}"`)

            // Addr1's balance should be now 0 NFT, and addr2 should be 1 NFT
            let balance1 = await firemen.balanceOf(addr1.address);
            let balance2 = await firemen.balanceOf(addr2.address);
            expect(balance1).to.equal(0);
            expect(balance2).to.equal(1);

            // Checking that Addr1 recevied the sale revenue
            let balanceEnd = parseInt(ethers.utils.formatEther(await ethers.provider.getBalance(addr1.address)));
            console.log(`>>> Addr1 has currently ${balanceEnd} ether`);
            expect(balanceEnd - balanceStart).to.equal(10);
        });


        it("Should display all your market listings", async function () {
            // Minting 4 NFTs
            const tokenNames = ['000', '111', '222', '333']
            for (const name of tokenNames) {
                const newlyMintedToken = await firemen.connect(addr1).payToMint(`${metadataURI}/${name}.json`, name, { value: ethers.utils.parseEther('0.05') });
                await newlyMintedToken.wait();
            }

            // Fetching the user's tokens
            const MyTokens = await firemen.connect(addr1).getMyTokens();
            expect(MyTokens.length).to.equal(tokenNames.length)
            console.log(MyTokens);

            // Creating market listings
            const listings = 4
            const listingPrice = ethers.utils.parseEther('10')

            for (let index = 0; index < listings; index++) {
                await firemen.connect(addr1).approveMarket(index);
                await market.connect(addr1).createMarketItem(firemen.address, index, listingPrice);
            }

            // Fetching ALL items currently for sale
            const items = await market.connect(addr1).fetchMyItems();

            // making the data human-readable
            const formattedItems = await Promise.all(items.map(async i => {
                const tokenURI = await firemen.tokenURI(i.tokenId);

                let item = {
                    price: parseInt(ethers.utils.formatEther(i.price)),
                    tokenId: i.tokenId.toString(),
                    seller: i.seller,
                    owner: i.owner,
                    nftContract: i.nftContract,
                    tokenURI
                };
                return item;
            }));

            console.log(formattedItems)

            expect(formattedItems.length).to.equal(listings);
        });


        it("Should allow cancelling a market listing and return the NFT to the seller", async function () {
            // Minting 4 NFTs
            const tokenNames = ['000', '111', '222', '333']
            for (const name of tokenNames) {
                const newlyMintedToken = await firemen.connect(addr1).payToMint(`${metadataURI}/${name}.json`, name, { value: ethers.utils.parseEther('0.05') });
                await newlyMintedToken.wait();
            }

            // Creating market listings
            const listings = 4
            const listingPrice = ethers.utils.parseEther('10')

            for (let index = 0; index < listings; index++) {
                await firemen.connect(addr1).approveMarket(index);
                await market.connect(addr1).createMarketItem(firemen.address, index, listingPrice);
            }

            // Fetching ALL items currently for sale
            const items = await market.connect(addr1).fetchMyItems();
            expect(items.length).to.equal(listings);


            // Cancelling a market listing
            await market.connect(addr1).removeMarketItem(2);

            // Again fetching all item for sales, there should be one fewer
            const newItems = await market.connect(addr1).fetchMyItems();
            expect(newItems.length).to.equal(listings - 1);

            // Checking Firemen balance
            let balance = await firemen.balanceOf(addr1.address);
            expect(balance).to.equal(1);
        });
    });
})