<!-- This is the header present on top of every page -->
<!-- Should contain the website logo, links to all pages, and the user's account & balance -->

<!-- JS -->
<script>
    import WalletConnect from "./WalletConnect.svelte"
</script>


<!-- HTML -->
<header>
    <div class="header-start">
        <p>FireMen NFT Inc.</p>
        <a href="/">Home</a>
        <a href="/profile">My Profile</a>
        <a href="/market">Market</a>
    </div>

    <div class="header-end">
        <WalletConnect />
    </div>
</header>