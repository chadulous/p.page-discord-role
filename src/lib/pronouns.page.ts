export async function userFromDiscordID(discordID: string, fetch: typeof window.fetch): Promise<User | null> {
    const name_res = await fetch(`https://pronouns.page/api/user/social-lookup/discord/${discordID}`)
    const name = await name_res.json()
    if (name === null) return null;
    return await userFromUsername(name, fetch)
}

export async function userFromUsername(pronouns_pageUsername: string, fetch: typeof window.fetch): Promise<User | null> {
    const res = await fetch(`https://pronouns.page/api/profile/get/${pronouns_pageUsername}?version=2`)
    const user: User = await res.json()
    if(user.id == undefined) return null
    return user
}

export interface User {
    id: string,
    username: string,
    emailHash: string,
    avatar: string,
    avatarSource: string,
    bannedReason: null,
    bannedTerms: string[],
    team: number,
    profiles: Record<string, Profile>,
}

export interface Profile {
    pronouns: OpinionVal[],
    names: NameOpinionVal[],
    opinions: Record<string, CustomOpinion>,
    description: string,
    age?: number,
    links: string[],
    linksMetadata: Record<string, { favicon: string | null, relMe: string[], nodeinfo: unknown }>
    verifiedLinks: Record<string, string>,
    flags: string[],
    customFlags: {
        value: string,
        name: string,
        description: string | null,
        alt: string | null,
        link: string | null
    }[],
    words: { header: string, values: OpinionVal[] }[],
    timezone: {
        tz: string,
        area: boolean,
        loc: boolean
    } | null,
    teamName: string,
    footerName: string,
    circle: CirclePerson[],
    lastUpdate: string
}

export interface CustomOpinion {
    icon: string,
    description: string,
    colour: string,
    style: string
}

export interface OpinionVal {
    value: string,
    opinion: string,
}

export interface NameOpinionVal extends OpinionVal {
    name: string
}

export interface CirclePerson {
    username: string,
    avatar: string,
    locale: string,
    relationship: string
}