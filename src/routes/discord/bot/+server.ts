import { env } from "$env/dynamic/private";
const { clientId } = env
import { redirect } from '@sveltejs/kit';

export function GET() {
    throw redirect(302, `https://discord.com/oauth2/authorize?client_id=${clientId}`)
}