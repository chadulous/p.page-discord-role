import { keys, kv } from '$lib/db';
import { userFromDiscordID } from '$lib/pronouns.page';
import { json } from '@sveltejs/kit';

export async function POST({ cookies, fetch }) {
    const sessionID = cookies.get('session')
    if (!sessionID) return json({ message: 'Not logged in', redirect: '/discord/link' })
    const { value: userId } = await kv.get(keys.authSession(sessionID))
    if (!userId || typeof userId != 'string') return json({ message: 'Not logged in', redirect: '/discord/link' })
    const user = await userFromDiscordID(userId, fetch)
    if (!user) return json({ message: 'Still unable to find account' })
    if(user.id === undefined) return json({ message: 'Still unable to find account' })
    await kv.set(keys.userPronounsPageID(userId), user.id)
    return json({ message: "YEAH!", redirect: true })
}
