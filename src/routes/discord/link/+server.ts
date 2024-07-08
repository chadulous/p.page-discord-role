import { discord } from "$lib/discord"
import { redirect } from "@sveltejs/kit"

export async function GET({ cookies }) {
    const state = crypto.randomUUID().replaceAll('-', '')
    const url = await discord.createAuthorizationURL(state, {
        scopes: ['identify', 'role_connections.write']
    })
    cookies.set('state', state, { maxAge: 1000 * 60 * 5, httpOnly: true, path: '/' })
    throw redirect(302, url)
}