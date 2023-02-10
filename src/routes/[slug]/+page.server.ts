import type { PageLoad } from './$types';

export async function load({ fetch, params }: PageLoad) {
	let gistId = params.slug;
	let gistRest = await (
		await fetch(`https://api.github.com/gists/${gistId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28'
			}
		})
	).json();
	let timereport = await (await fetch(gistRest.files.timereport.raw_url)).text();

	return { timereport };
}
