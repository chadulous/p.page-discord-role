import { clientId } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export function GET() {
    throw redirect(302, `https://discord.com/oauth2/authorize?client_id=${clientId}`)
}