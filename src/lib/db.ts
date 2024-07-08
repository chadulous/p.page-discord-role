export const keys = {
    userTokens: (discordid: string) => ['user', discordid, 'tokens'],
    userPronounsPageID: (PPid: string) => ['user', PPid, 'id'],
    authSession: (id: string) => ['session', id],
    lastUpdate: (discordid: string) => ['user', discordid, 'upd']
}

import { building } from '$app/environment';

let kv: import("@deno/kv").Kv

if(!building) {
    if("Deno" in globalThis) {
        // @ts-expect-error: You know what typescript. I don't care.
        kv = await Deno.openKv()
    } else {
        const { openKv } = await import("@deno/kv");
        kv = await openKv()
    }
}

export { kv }