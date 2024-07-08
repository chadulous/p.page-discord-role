import { env } from "$env/dynamic/private";
const { clientId } = env
import { keys, kv } from '$lib/db.js'
import { getAccessToken, pushMetadata, revokeAccessToken } from '$lib/discord.js'
import { userFromDiscordID } from '$lib/pronouns.page.js'
import { redirect } from '@sveltejs/kit'

export async function load({ cookies, fetch }) {
    const sessionID = cookies.get('session')
    if (!sessionID) throw redirect(302, '/discord/link')
    const { value: userId } = await kv.get(keys.authSession(sessionID))
    if (!userId || typeof userId != 'string') throw redirect(302, '/discord/link')
    const user = await userFromDiscordID(userId, fetch)
    if (!user) throw redirect(302, '/link')
    if(user.id === undefined) throw redirect(302, '/link')
    await kv.set(keys.userPronounsPageID(userId), user.id)
    const lastUpdate = await kv.get<Date>(keys.lastUpdate(userId))
    const updateDate = new Date()
    if (!lastUpdate.value || updateDate.getTime() - lastUpdate.value.getTime() >= 900000) {
        const accessToken = await getAccessToken(userId)
        if (!accessToken) throw redirect(302, '/discord/link')
        const res = await pushMetadata(accessToken, user.username)
        if(res.ok) kv.set(keys.lastUpdate(userId), updateDate)
    }
    return { username: user.username, avatar: user.avatar, pid: user.id, did: userId, lastUpdate: lastUpdate.value || updateDate }
}

export const actions = {
    disconnect: async ({ cookies }) => {
        const sessionID = cookies.get('session')!
        const res = await kv.get(keys.authSession(sessionID))
        const userId = res.value!.toString()
        const accessToken = await getAccessToken(userId)
        await pushMetadata(accessToken!)
        await kv.atomic()
            .delete(keys.authSession(sessionID))
            .delete(keys.lastUpdate(userId))
            .delete(keys.userPronounsPageID(userId))
            .delete(keys.userTokens(userId))
        .commit()
        await revokeAccessToken(userId)
        cookies.delete('session', { path: '/' })
        cookies.delete('state', { path: '/' })
        throw redirect(302, '/')
    }
}