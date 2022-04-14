<!-- This is the base page layout that all pages inherit from -->

<!-- Importing base components -->
<script>
    // import header/banner
    // import footer
    // import logos
    // maybe import the ethereum shit here?

    import Header from '../components/Header.svelte'
    import Install from '../components/Install.svelte'
</script>


<!-- Main HTML layout -->
<!-- Header -->
<Header />
<main>
    <!-- Slot includes the content from the page components that inherit from this -->
    <slot></slot>

    <!-- Footer -->
    <footer>this is the footer</footer>
</main>