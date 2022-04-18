<!-- Overlay/modal prompting users to install MetaMask -->

<!-- JS -->
<script>
    export let toggled = false

    const toggleOverlay = () => {
        toggled = !toggled
    }
</script>


<!-- HTML -->
<div class="overlay-container">

    <!-- Message box with Metamask link -->
    <div class="overlay-message">
        <slot></slot>
    </div>

    <!-- Full screen button to close overlay when clicking anywhere else -->
    <button class="close-overlay" on:click={toggleOverlay}>
        Close
    </button>
</div>