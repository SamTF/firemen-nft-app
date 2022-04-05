<!-- A Card showing the NFT image and properties -->

<!-- JS -->
<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import MintToken from './MintToken.svelte'

    // Importing IPFS constants
    import { ipfsCID, ipfsGateway } from '../lib/constants'
    import { shortAddr } from '../lib/utils'

    // Props
    export let id
    export let contract

    // Vars
    const metadataURI = `${ipfsCID}/${id}.json`
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
        console.log(`Owner of ${id} -> ${result}`)
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
            href={`https://etherscan.io/address/${owner}`} target="_blank"
            class="addr-btn"
        >
            <b>ⓘ</b>
            {shortAddr(owner)}
        </a>
    {/if}
</div>


<!-- CSS -->
<style>
    .nft-card {
        display: flex;
        flex-direction: column;

        padding: 1rem;
        border: 10px solid black;
        border-radius: 20px;
    }

    .nft-card img {
        max-height: 256px;
        max-width: 256px;
    }


    .mint-status {
        display: grid;
        place-items: center;

        margin-top: -1rem;
        z-index: -10;
    }

    .sold {
        background-color: grey;
        color: white;
        width: fit-content;
        padding: 0.5rem 1rem;

        margin: 0;
        width: 100%;
    }

    .available {
        background-color: rgb(143, 197, 62);
        color: white;
        width: fit-content;
        padding: 0.5rem 1rem;

        margin: 0;
        width: 100%;
    }

    /* NFT Owner Address */
    .addr-btn {
        padding: 0.5rem 0.75rem;
        border-radius: 10px;

        border: none;
        background-color: #00C1FF;
        color: whitesmoke;
        
        font-family: inherit;
        font-size: 1rem;
        /* font-weight: bold; */
        text-decoration: none;

        cursor: pointer;
    }

    .addr-btn:hover {
        background-color: #5cd6ff;
    }
</style>