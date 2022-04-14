<script>
    // Packages
    import { ethers } from 'ethers'
    import { FireMenABI, contractAddress } from '../lib/constants'
    import { contract, provider, signer } from '../lib/ethereum'
    import { onMount } from "svelte";
    
    // My Components
    import TokenList from '../components/TokenList.svelte'

    // debug function to check that the contract loaded successfully
    const getByteCode = async () => {
        const bytecode = await provider.getCode(contractAddress)
        console.log(bytecode)
    }

    // Client-side Start
    onMount(async () => {
        if (window.ethereum) {
            getByteCode()

            // Reloading the page on network changes
            window.ethereum.on('chainChanged', async (_chainId) => {
                window.location.reload()
            });
        }
    })
</script>

<main>
    <img src='/images/svelte.png' alt="Svelte Logo" />
    <h1>Firemen NFT App</h1>

    <p></p>
    <h3>Welcome to my localhost NFT testing website</h3>

    <br><br>

    <TokenList {contract} />
</main>