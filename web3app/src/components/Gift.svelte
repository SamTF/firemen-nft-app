<!-- Overlay form to gift an NFT -->

<!-- JS -->
<script>
    // Imports
    import { ethers } from 'ethers'
    import { contract, provider, signer } from '../lib/ethereum'
    import Overlay from './Overlay.svelte'

    export let showOverlay = false
    export let tokenName = ''

    const toggleOverlay = () => showOverlay = !showOverlay

    let giftAddress = ""

    const giftFireman = async () => {
        console.log(`attempting to send gift to ${giftAddress}...`)

        if (ethers.utils.isAddress(giftAddress)) {
            console.log(`${giftAddress} is valid!`)
        } else {
            console.error('Address is invalid!!!')
            return
        }

        const tokenId = await contract.getTokenIdByName(tokenName)
        const transfer = await contract.transferToken(giftAddress, 0)

        console.log(`Gifted NFT #${tokenName} to ${giftAddress}!`)
    }
</script>


<!-- HTML -->
{#if showOverlay}
    <Overlay bind:toggled={showOverlay}>
        <h3>Gift a Fireman to your friends! :)</h3>
        
        <p>Enter their Ethereum address</p>

        <input type="text" bind:value={giftAddress} placeholder="0x..."><br>

        <button class="btn-gift" on:click={giftFireman}>Send!</button>
    </Overlay>
{/if}


<!-- CSS -->
<style>
    input {
        font-family: inherit;
        font-size: 1rem;
        z-index: 100;

        background: white;
        color: black;
        border: 2px solid orangered;
        border-radius: 5px;
        outline: none;

        padding: 10px 20px;
    }

    .btn-gift {
        padding: 10px 20px;
        margin-bottom: 0;

        margin-top: 1rem;
        font-family: inherit;
        font-size: 1rem;

        border: none;
        border-radius: 15px;
        color: white;
        background-color: orangered;

        cursor: pointer;
    }
</style>