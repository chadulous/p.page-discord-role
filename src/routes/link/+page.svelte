<script lang=ts>
    import { writable } from "svelte/store"
    import { tweened } from 'svelte/motion'
    import { linear } from 'svelte/easing';

    const message = writable('')
    const timer = tweened(5)
    let btn: HTMLButtonElement;
    async function checkAgain() {
        const res = await fetch('', { method: 'POST', credentials: 'include' })
        const json = await res.json()
        btn.remove()
        message.set(`${json.message}`)
        timer.set(0, { duration: 5000, easing: linear })
        const href = json.redirect === true?'/next':json.redirect;
        timer.subscribe((value) => {
            if(value <=0) window.location.pathname = href
        })
    }
</script>

it appears we can't find your pronouns.page from your discord!<br>
<ol>
    <li>go <a href="https://en.pronouns.page/account">here</a>, click <code>Login methods</code></li>
    <li>link discord if it hasn't been already</li>
    <li>turn on the switch next to 'Allow getting my profile looked up by social media handles / identifiers' <sup><a href="#fn1" id="ref1">[1]</a></sup></li>
    <li>click the button below</li>
</ol>

<sup><a id="fn1" href="#ref1">1</a></sup> don't worry, you can turn it back off after verifying!<br>

<button bind:this={btn} on:click={checkAgain}>Check again</button><br>
{#if $message}
    <span>{$message} ({$timer.toPrecision(3)})</span>
{/if}