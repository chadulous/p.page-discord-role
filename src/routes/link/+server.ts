import { error } from '@sveltejs/kit';

export async function POST({ cookies }) {
    return error(500, "not impl")
}