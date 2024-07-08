import { env } from "$env/dynamic/private";
const { clientId } = env
import { keys, kv } from '$lib/db.js'
import { getAccessToken } from '$lib/discord.js'
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
        const url = `https://discord.com/api/v10/users/@me/applications/${clientId}/role-connection`
        const accessToken = await getAccessToken(userId)
        if (!accessToken) throw redirect(302, '/discord/link')
        const body = {
            platform_name: 'pronouns.page',
            platform_username: `@${user.username}`
        }
        const res = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        if(res.ok) kv.set(keys.lastUpdate(userId), updateDate)
        const json = await res.json()
        console.log(json)
    }
    return { username: user.username, avatar: user.avatar, pid: user.id, did: userId, lastUpdate: lastUpdate.value || updateDate }
}