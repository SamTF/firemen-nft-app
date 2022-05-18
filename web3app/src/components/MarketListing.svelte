<!-- Overlay form to put an NFT up for sale on the Market -->

<!-- JS -->
<script>
    // Imports
    import { ethers } from 'ethers'
    import { contract, marketContract } from '../lib/ethereum'
    import { ipfsGateway, contractAddress } from '../lib/constants'
    import Overlay from './Overlay.svelte'

    export let showOverlay = false
    export let token = null

    const toggleOverlay = () => showOverlay = !showOverlay

    let price = 1
    let message = {text: '', status: ''}

    // Putting the given NFT for sale on the Market
    const createMarketListing = async () => {
        console.log(`attempting to put up NFT #${token.name} for sale for ${price} ETH...`)

        // Get tokenId by name, and approve it for the Market contract
        const tokenId = await contract.getTokenIdByName(token.name)

        const isApproved = await contract.checkApproval(tokenId)

        if (!isApproved) {
            const approve = await contract.approveMarket(tokenId)
            await approve.wait()
        }

        // Create a Market Listing
        const listingPrice = ethers.utils.parseEther(price.toString())
        const listing = await marketContract.createMarketItem(contractAddress, tokenId, listingPrice)
        await listing.wait()
        

        // Success message
        console.log(`Listed NFT #${token.name} on the market for ${price} ETH!`)
        message = { text: 'Successfully listed Fireman for sale 🥳', status: 'success' }

        // Reload the page after 1 second
        setTimeout(() => {  window.location.reload() }, 1000);
    }
</script>


<!-- HTML -->
{#if showOverlay}
    <Overlay bind:toggled={showOverlay}>
        <div class="gift-overlay">
            <h3>Sell a Fireman on the Market</h3>

            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/money-with-wings_1f4b8.png" alt="sale icon" class="gift-icon">
            <img src={`${ipfsGateway}${token.image_cid}`} alt="fireman" class="fireman">
            
            <p>Enter sell price (in ETH)</p>

            <input
                type="number"
                bind:value={price}
                min="0.001" max="999999" step="0.001"
            >

            <button class="btn-gift" on:click={createMarketListing}>Sell!</button>

            {#if message.text}
                <p class="message {message.status}">
                    {message.text}
                </p>
            {/if}
        </div>
    </Overlay>
{/if}