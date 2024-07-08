<script>
    import { writable } from "svelte/store";
    const message = writable('')

    async function checkAgain() {
        const res = await fetch('/', { method: 'POST', credentials: 'include' })
        const json = await res.json()
    }
</script>

it appears we can't find your pronouns.page from your discord!<br>
<ol>
    <li>go <a href="https://en.pronouns.page/account">here</a>, click <code>Login methods</code></li>
    <li>link discord if it hasn't been already</li>
    <li>turn on the switch next to 'Allow getting my profile looked up by social media handles / identifiers' (don't worry, you cant turn it back off after verifying!)</li>
    <li>click the button below</li>
</ol>

<button on:click={checkAgain}>Check again</button>
<span>{$message}</span>