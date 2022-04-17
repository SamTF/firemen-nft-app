<!-- Cards for the NFTs owned by an address, as seen in their profile page -->

<!-- JS -->
<script>
    import { fade, slide } from 'svelte/transition'
    import { FireMenABI, contractAddress, ipfsGateway } from '../lib/constants'
    import MintToken from './MintToken.svelte';

    export let token = {}

    let showDetails = false
    const toggleDetails = () => showDetails = !showDetails
</script>


<!-- HTML -->
<div
    class="my-nft"
    in:fade
    on:click={toggleDetails}
    data-expanded={showDetails}
>
    <!-- test -->
    {#if showDetails}
        <div class="name" transition:slide>
            <p>NFT #{token.name}</p>
        </div>
    {/if}
    
    <!-- NFT Image -->
    <img src={`${ipfsGateway}${token.image_cid}`} alt={token.name}>

    <!-- NFT Details -->
    {#if showDetails}
        <div transition:slide>
            <!-- <p>NFT #{token.name}</p> -->
            <p><b>⚤:</b> {token.attributes[0].gender}</p>
            <p><b>Rarity:</b> {Math.round(token.attributes[0].rarity)}</p>
            <a class="btn-owner-addr" href="/market" target="_blank" style="margin-bottom: 1rem;">
                <b>💸</b> Create Listing
            </a>
        </div>
    {/if}
</div>