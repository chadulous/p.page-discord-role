<script>
    export let data;
</script>

Congrats <code>{data.username}</code>! You have successfully authenticated!<br>
You may continue <strike>yapping</strike> chatting on discord!<br>
<img src="{data.avatar}" alt="avatar of {data.username}"><br>

if you change your pronouns.page username and you want to update it come back to this page later!<br>
(You can only update every 15 minutes, you last updated at {data.lastUpdate.toLocaleTimeString()} on {data.lastUpdate.toLocaleDateString()})<br>

<details>
    <summary>nerd stat</summary>
    discord id {data.did} x pronouns.page id {data.pid}
</details>