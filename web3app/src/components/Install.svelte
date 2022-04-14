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
    <div class="overlay-message" on:click={() => {console.log("clicked overlay")}}>
        <h3>
            Go ahead and <a href="https://metamask.io/download/" target="_blank">install MetaMask</a> or some other wallet there buddy
        </h3>
    </div>

    <!-- Full screen button to close overlay when clicking anywhere else -->
    <button on:click={toggleOverlay}>
        Close
    </button>
</div>