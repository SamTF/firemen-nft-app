<script>
    // Packages
    import { ethers } from 'ethers'
    import { contractAddress, marketAddress } from '../lib/constants'
    import { contract, provider, signer } from '../lib/ethereum'
    import { onMount } from "svelte";
    
    // My Components
    import TokenList from '../components/TokenList.svelte'
    import Meta from '../components/Metadata/Meta.svelte'

    // debug function to check that the contract loaded successfully
    const getByteCode = async (address) => {
        const bytecode = await provider.getCode(address)
        console.log(bytecode)
    }

    // Client-side Start
    onMount(async () => {
        if (window.ethereum) {
            getByteCode(contractAddress)
            getByteCode(marketAddress)

            // Reloading the page on network changes
            window.ethereum.on('chainChanged', async (_chainId) => {
                window.location.reload()
            });
        }
    })
</script>


<!-- HTML -->
<main>
    <Meta title="Firemen NFT | Collection" />

    <img src='/images/Fireman.webp' alt="Fireman" class="logo" />
    <h1>Firemen NFT App</h1>

    <br>

    <h3>Welcome to my NFT website I made to learn Web3.0 and Smart Contracts</h3>

    <br>

    <TokenList {contract} />
</main>