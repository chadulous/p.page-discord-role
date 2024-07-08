import { keys, kv } from "$lib/db"
import { discord, getAccessToken } from "$lib/discord"
import { redirect } from "@sveltejs/kit"

export async function GET({ cookies }) {
    const sessionID = cookies.get('session')
    sessionCheck: if(sessionID) {
        const { value: userId } = await kv.get(keys.authSession(sessionID))
        if(!userId) break sessionCheck
        if(typeof userId != 'string') { await kv.delete(keys.authSession(sessionID)); break sessionCheck }
        const accessToken = await getAccessToken(userId)
        if(!accessToken) break sessionCheck;
        throw redirect(302, '/next');
    }
    const state = crypto.randomUUID().replaceAll('-', '')
    const url = await discord.createAuthorizationURL(state, {
        scopes: ['identify', 'role_connections.write']
    })
    cookies.set('state', state, { maxAge: 1000 * 60 * 5, httpOnly: true, path: '/' })
    throw redirect(302, url)
}