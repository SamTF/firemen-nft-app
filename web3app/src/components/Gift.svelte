<!-- Overlay form to gift an NFT -->

<!-- JS -->
<script>
    // Imports
    import { ethers } from 'ethers'
    import { contract, provider, signer } from '../lib/ethereum'
    import { ipfsGateway } from '../lib/constants'
    import Overlay from './Overlay.svelte'
    import Loading from './UI/Loading.svelte'

    export let showOverlay = false
    export let token = null

    const toggleOverlay = () => showOverlay = !showOverlay

    let giftAddress = ''
    let message = {text: '', status: ''}
    let isLoading = false

    const giftFireman = async () => {
        console.log(`attempting to send gift to ${giftAddress}...`)

        // Validating the given address
        if (!ethers.utils.isAddress(giftAddress)) {
            console.error('Address is invalid!!!')
            message = { text: 'Address is invalid! ❌', status: 'error' }
            giftAddress = ''
            return
        }

        isLoading = true

        // The tokenId by name, and transfer it to the requested address
        const tokenId = await contract.getTokenIdByName(token.name)
        const transfer = await contract.transferToken(giftAddress, tokenId)
        await transfer.wait();
        isLoading = false

        // Success message
        console.log(`Gifted NFT #${token.name} to ${giftAddress}!`)
        message = { text: 'Successfully gifted Fireman! 🥳', status: 'success' }

        // Reload the page after 1 second
        setTimeout(() => {  window.location.reload() }, 2000);
    }
</script>


<!-- HTML -->
{#if showOverlay}
    <Overlay bind:toggled={showOverlay}>
        <div class="gift-overlay">
            <h3>Gift a Fireman to your friends! :)</h3>

            <img src="images/wrapped-gift.png" alt="gift icon" class="gift-icon">
            <img src={`${ipfsGateway}${token.image_cid}`} alt="fireman" class="fireman">
            
            <p>Enter their Ethereum address</p>

            <input type="text" bind:value={giftAddress} placeholder="0x..."><br>

            <!-- Gift Button -->
            <button
                class="btn-gift"
                on:click={giftFireman}
                disabled={isLoading}
            >
                {#if !isLoading}
                    Send! 📨
                {:else}
                    <Loading />
                {/if}
            </button>

            {#if message.text}
                <p class="message {message.status}">
                    {message.text}
                </p>
            {/if}
        </div>
    </Overlay>
{/if}