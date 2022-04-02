<!-- A Card showing the NFT image and properties -->

<!-- JS -->
<script>
    import { onMount } from 'svelte';

    // Importing IPFS constants
    import { ipfsCID, ipfsGateway } from '../lib/constants'

    // Props
    export let id
    export let contract

    // Vars
    const metadataURI = `${ipfsGateway}${ipfsCID}/${id}.json`
    const imageURI = `${ipfsGateway}${ipfsCID}/${id}.png`
    let minted = false

    // Checks if an NFT has been minted using the Smart Contract
    const isMinted = async () => {
        console.log('hello')
        const result = await contract.isContentOwned(metadataURI)
        console.log(`${metadataURI} : ${result}`)

        minted = result
    }

    onMount(isMinted)
</script>

<!-- HTML -->
<div class="nft-card">
    <img 
        src={imageURI}
        alt={`NFT #${id}`}
        loading="lazy"
    >

    <p>NFT #{id}</p>

    <div class="mint-status">
        {#if minted}
            <div class="sold">❌ Sold</div>
        {:else}
            <div class="available">🛒 Available!</div>
        {/if}
    </div>
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
    }

    .sold {
        background-color: grey;
        color: white;
        width: fit-content;
        padding: 0.5rem 1rem;
    }

    .available {
        background-color: rgb(143, 197, 62);
        color: white;
        width: fit-content;
        padding: 0.5rem 1rem;
    }
</style>