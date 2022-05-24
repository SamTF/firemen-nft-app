<script>
    // Packages
    import { ethers } from 'ethers'
    import { contractAddress, marketAddress } from '../lib/constants'
    import { contract, provider, signer } from '../lib/ethereum'
    import { onMount } from "svelte";

    import { connectedAccount } from '../stores/store'
    import { chainId, networkParams } from '../lib/constants'
    
    // My Components
    import TokenList from '../components/TokenList.svelte'
    import Meta from '../components/Metadata/Meta.svelte'

    const polygonChainId = 80001
    let currentChaindId = 0

    $: onRightNetwork = chainId == currentChaindId

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

            // Get current network
            const { chainId } = await provider.getNetwork()
            console.log("ChainID:")
            console.log(chainId)
            currentChaindId = chainId
        }
    })

    // Add the Polygon Mumbai testnet to Metamask
    const addNetwork = async () => {
        console.log("Adding network to metamask...")

        if (!window.ethereum) {
            console.error("Metamask is not installed")
            alert("You must have MetaMask installed on your browser")
            return
        }
        
        // https://ethereum.stackexchange.com/questions/93594/add-custom-networkbnb-in-meta-mask-using-web3
        window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams]
        })
        .catch((error) => {
            console.log(error)
        }) 
    }
</script>


<!-- HTML -->
<main>
    <Meta title="Firemen NFT | Collection" />

    <img src='/images/Fireman.webp' alt="Fireman" class="logo" />
    <h1>Firemen NFT App</h1>

    <br>

    <h3>Welcome to my NFT website I made to learn Web3.0 and Smart Contracts</h3>

    <br>

    {#if !onRightNetwork}
        <p><code>Please make sure you are on the Polygon Mumbai testnet!</code></p>
        <button
            class="connect-wallet"
            on:click={addNetwork}
        >
            Add network to MetaMask
        </button>
    {/if}

    <TokenList {contract} />
</main>