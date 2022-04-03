<script>
    import logo from "./assets/svelte.png";
    import Counter from "./lib/Counter.svelte";

    // Packages
    import { ethers } from 'ethers'
    
    // My Components
    import Install from './components/Install.svelte'
    import WalletConnect from './components/WalletConnect.svelte'
    import TokenList from './components/TokenList.svelte'
</script>

<main>
    <img src={logo} alt="Svelte Logo" />
    <h1>Fireship NFT App</h1>

    <Counter />

    <p></p>
    <h3>Welcome to my localhost NFT testing website</h3>
    <WalletConnect />

    <br><br>

    <TokenList />


</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Comic Sans MS", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    main {
        display: grid;
        place-items: center;

        text-align: center;

        padding: 1em;
        max-width: 90vw;
        margin: 0 auto;
    }

    img {
        height: 16rem;
        width: 16rem;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
        max-width: 14rem;
    }

    p {
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }

    @media (min-width: 480px) {
        h1 {
            max-width: none;
        }

        p {
            max-width: none;
        }
    }
</style>
