<!-- This contains metadata tags embedded into the <head> -->
<!-- used for link embeds -->

<!-- JS -->
<script>
    export let title = "Firemen NFT Collection & Market"
    export let description = "Collect, Gift, & Trade hundreds of cute Firemen 🔥"
    export let thumbnail = "http://nft.currencything.com/images/Fireman.webp"
    export let colour = "#FF3E00"
</script>

<!-- Link embed stuff! -->
<svelte:head>
    <title>{title}</title>

    <meta name="description"        content={description}>
    <meta property="og:site_name"   content="nft.currencything.com">                    <!-- Top of the embed -->
    <meta property="og:title"       content={title}>                                    <!-- Big Bold Letters -->
    <meta property="og:description" content={description}>                              <!-- Subtitle, smaller, under title -->
    <meta property="og:image"       content={thumbnail}>                                <!-- Cool lil thumbnail to the side! :) -->
    <meta property="og:url"         content={import.meta.env.VITE_DOMAIN}>              <!-- Link when you click on the title -->
    <meta name="theme-color"        content={colour}>                                   <!-- Embed sidebar colour! -->
    <meta name="twitter:card"       content="summary_large_image">                      <!-- BIG image -->
</svelte:head>