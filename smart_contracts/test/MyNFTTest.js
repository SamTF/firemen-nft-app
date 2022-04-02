const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
    it("Should mint and transfer an NFT to a paying user", async function () {
        const FireMen = await ethers.getContractFactory("FireMen");
        const firemen = await FireMen.deploy();
        await firemen.deployed();

        const recipient = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199';
        const metadataURI = 'cid/test.png';

        // Getting the address' NFT balance
        let balance = await firemen.balanceOf(recipient);
        expect(balance).to.equal(0);

        // Minting a new NFT
        const newlyMintedToken = await firemen.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.05') });

        // Wait until the minting tx has been mined/confirmed
        await newlyMintedToken.wait();

        // Check that the address now owns exactly 1 NFT
        balance = await firemen.balanceOf(recipient);
        expect(balance).to.equal(1);

        // Check that the NFT with that URI is now owned
        expect(await firemen.isContentOwned(metadataURI)).to.equal(true);

        console.log("Testing over :)");
    });
});
