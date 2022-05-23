<!-- JS -->
<script>
    // Constants & Stores
    import { contract, provider, signer } from '../lib/ethereum'
    import { connectedAccount } from '../stores/store'

    // Components
    import MyNFTList from '../components/MyNFTList.svelte'
    import Meta from '../components/Metadata/Meta.svelte'


    const signMessage = async (msg) => {
        const currentDate = new Date()

        let message = `
            nft.firemen.com wants you to sign in with your Ethereum account:
            ${$connectedAccount}\n
            Connect to GameStop NFT? By connecting you agree to our Terms & Conditions and Privacy Policy.
            \n
            URI: https://nft.firemen.com
            Version: 1
            Chain ID: 1
            Nonce: izPtdS5gC090qJzZF
            Issued At: ${currentDate}
            Expiration Time: 2022-04-11T07:03:19.820Z
        `
        let mySignature = await signer.signMessage(message)
        console.log(mySignature)
        return mySignature
    }    
</script>


<!-- HTML -->
<main>
    <Meta title="Firemen NFT | My Profile" />

    <img src='/images/Fireman.webp' alt="Fireman pixel art" class="logo" />
    <h1>Your Fireman Profile</h1>

    <p>look at you!</p>

    <p></p>
    <button on:click={() => signMessage("hello man")}>Sign message</button>

    <p></p>

    <MyNFTList />
</main>