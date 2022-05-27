<!-- A Card showing the NFT image and properties -->

<!-- JS -->
<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import MintToken from './MintToken.svelte'

    // Importing IPFS constants
    import { ipfsCID, metadataCID, ipfsGateway, blockExplorer } from '../lib/constants'
    import { shortAddr } from '../lib/utils'

    // Props
    export let id
    export let contract

    // Vars
    const metadataURI = `${metadataCID}/${id}.json`
    const imageURI = `${ipfsGateway}${ipfsCID}/${id}.png`
    let minted = false
    let owner = ''

    // Checks if an NFT has been minted using the Smart Contract
    const isMinted = async () => {
        const result = await contract.isContentOwned(metadataURI)
        minted = result

        if (minted) getOwner()
    }

    // Get the address of the current NFT owner
    const getOwner = async () => {
        const result = await contract.getOwnerByName(id)
        owner = result
    }

    // Emit event to update minted token counter
    const dispatch = createEventDispatcher();

    const onMinted = async () => {
        await isMinted()
        dispatch('minted', {isMinted: true, tokenId: id})
    }

    onMount(isMinted)
</script>

<!-- HTML -->
<div class="nft-card">
    <div class="mint-status">
        {#if minted}
            <div class="sold">❌ Sold</div>
        {:else}
            <div class="available">🛒 Available!</div>
        {/if}
    </div>

    <img 
        src={imageURI}
        alt={`NFT #${id}`}
        loading="lazy"
    >

    <p>NFT #{id}</p>

    {#if !minted}
        <MintToken {metadataURI} {id} on:minted={onMinted} />
    {:else}
        <a 
            class="btn-owner-addr"
            href={`${blockExplorer}address/${owner}`} target="_blank"
        >
            <b>ⓘ</b>
            {shortAddr(owner)}
        </a>
    {/if}
</div>