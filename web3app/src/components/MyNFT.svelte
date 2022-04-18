<!-- Cards for the NFTs owned by an address, as seen in their profile page -->

<!-- JS -->
<script>
    import { fade, slide } from 'svelte/transition'
    import { FireMenABI, contractAddress, ipfsGateway } from '../lib/constants'
    import { createEventDispatcher } from 'svelte';

    export let token = {}

    let showDetails = false
    const toggleDetails = () => showDetails = !showDetails

    const dispatch = createEventDispatcher();

    const onSendGift = () => {
        console.log('User wants to gift this NFT:')
        console.table(token)
        dispatch('sendGift', { token })
    }
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
            <!-- General details -->
            <p><b>⚤:</b> {token.attributes[0].gender}</p>
            <p><b>Rarity:</b> {Math.round(token.attributes[0].rarity)}</p>

            <hr style="background: black; margin-bottom: 1rem">

            <!-- Actions -->
            <a class="btn-owner-addr" href="/market" target="_blank" style="margin-bottom: 1rem;">
                <b>💸</b> Create Listing
            </a>

            <a class="btn-owner-addr" href="" style="margin-bottom: 1rem;" on:click={onSendGift}>
                <b>🎁</b> Send as gift
            </a>
        </div>
    {/if}
</div>