import { env } from "$env/dynamic/private";
const { clientId, clientSecret } = env
import { Discord, type DiscordTokens } from "arctic";
import { keys, kv } from "./db";
import { dev } from "$app/environment"


export const discord = new Discord(clientId, clientSecret, dev?'http://localhost:5173/discord/callback':'https://prpage-discord.deno.dev/discord/callback');

export async function getUserData(accessToken: string) {
    const URL = "https://discord.com/api/users/@me"
    const response = await fetch(URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return await response.json()
}

export async function getAccessToken(userId: string) {
    const { value: tokens } = await kv.get<DiscordTokens>(keys.userTokens(userId))
    if(!tokens) return null
    if (Date.now() > tokens.accessTokenExpiresAt.getTime()) {
        const ref = await discord.refreshAccessToken(tokens.refreshToken)
        await kv.set(keys.userTokens(userId), ref)
        return ref.accessToken
    }
    return tokens.accessToken
}
