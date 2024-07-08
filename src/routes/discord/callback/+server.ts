import { kv, keys } from '$lib/db'
import { discord, getUserData } from '$lib/discord'
import { json, redirect } from '@sveltejs/kit'

export async function GET({ url, cookies }) {
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    const saved_state = cookies.get('state')

    if(saved_state !== state || code === null) {
        return json({ message: "Verification failed", status: 403, }, {
            status: 403,
            statusText: "Verification failed"
        })
    }

    const tokens = await discord.validateAuthorizationCode(code);
    const me = await getUserData(tokens.accessToken);
    const sessionID = crypto.randomUUID()

    await kv.atomic()
        .set(keys.userTokens(me.id), tokens)
        .set(keys.authSession(sessionID), me.id)
        .commit()
    
    cookies.set('session', sessionID, { httpOnly: true, path: '/' })
    throw redirect(302, "/next")
}