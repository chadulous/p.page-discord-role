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

export async function getAccessToken(userId: string, getRef = false) {
    const { value: tokens } = await kv.get<DiscordTokens>(keys.userTokens(userId))
    if(!tokens) return null
    if (Date.now() > tokens.accessTokenExpiresAt.getTime()) {
        const ref = await discord.refreshAccessToken(tokens.refreshToken)
        await kv.set(keys.userTokens(userId), ref)
        return getRef?ref.refreshToken:ref.accessToken
    }
    return getRef?tokens.refreshToken:tokens.accessToken
}

export async function pushMetadata(accessToken: string, username?: string) {
    const URL = `https://discord.com/api/v10/users/@me/applications/${clientId}/role-connection`
    const body = username?{
        platform_name: 'pronouns.page',
        platform_username: `@${username}`
    }:{}
    return await fetch(URL, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
}

export async function revokeAccessToken(userId: string) {
    const URL = 'https://discord.com/api/oauth2/token/revoke'
    await fetch(URL, {
        method: 'POST',
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            token: (await getAccessToken(userId, true))!,
            token_type_hint: 'refresh_token'
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
}