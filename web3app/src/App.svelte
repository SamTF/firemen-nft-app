<script>
    import logo from "./assets/svelte.png";

    // Packages
    import { ethers } from 'ethers'
    import { FireMenABI, contractAddress } from './lib/constants'
    import { contract, provider, signer } from './lib/ethereum'
    import { onMount } from "svelte";
    
    // My Components
    import Install from './components/Install.svelte'
    import WalletConnect from './components/WalletConnect.svelte'
    import TokenList from './components/TokenList.svelte'


    

    const getByteCode = async () => {
        const bytecode = await provider.getCode(contractAddress)
        console.log(bytecode)
    }

    if (window.ethereum) {
        onMount(getByteCode)
    }  
</script>

<main>
    <img src={logo} alt="Svelte Logo" />
    <h1>Fireship NFT App</h1>

    <p></p>
    <h3>Welcome to my localhost NFT testing website</h3>
    <WalletConnect />

    <br><br>

    <TokenList {contract} />


</main>