import { clientId, clientSecret } from "$env/static/private";
import { Discord, type DiscordTokens } from "arctic";
import { keys, kv } from "./db";
export const discord = new Discord(clientId, clientSecret, 'https://prpage-discord.deno.dev/discord/callback');

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
