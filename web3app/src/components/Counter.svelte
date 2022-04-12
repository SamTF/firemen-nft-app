<!-- Simple component that tracks a value and animates when it changes -->

<!-- JS -->
<script>
    // Animations
    import { fly } from 'svelte/transition'

    // Props
    export let value
    export let description
    export let colour
</script>


<!-- HTML -->
<div class="counter">
    <div class="counter" style="--colour: {colour}">
        {#key value}
            <p in:fly="{{ y: -20, duration: 500 }}">
                {value} {description}
            </p>
        {/key}
    </div>
</div>


<!-- CSS -->
<style>
    .counter {
        /* Colour */
        color: rgb(var(--colour));
        background-color: rgba(var(--colour), 0.1);
        border: 2px solid rgba(var(--colour), 0.5);
    }
</style>