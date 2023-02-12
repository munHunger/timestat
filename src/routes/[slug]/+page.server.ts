import type { PageLoad } from './$types';
import nearley from 'nearley';
import compile from 'nearley/lib/compile';
import generate from 'nearley/lib/generate';
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped';
import grammar from '$lib/grammar.ne?raw';

interface Time {
	hours: number;
	minutes: number;
}

interface Date {
	year: number;
	month: number;
	day: number;
}

function compileGrammar(sourceCode: string) {
	// Parse the grammar source into an AST
	const grammarParser = new nearley.Parser(nearleyGrammar);
	grammarParser.feed(sourceCode);
	const grammarAst = grammarParser.results[0]; // TODO check for errors

	// Compile the AST into a set of rules
	const grammarInfoObject = compile(grammarAst, {});
	// Generate JavaScript code from the rules
	const grammarJs = generate(grammarInfoObject, 'grammar');

	// Pretend this is a CommonJS environment to catch exports from the grammar.
	const module = { exports: {} };
	eval(grammarJs);

	return module.exports;
}

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

	try {
		const parser = new nearley.Parser(nearley.Grammar.fromCompiled(compileGrammar(grammar)));
		let parsed: Array<{
			date: Date;
			start: Time;
			end: Time;
			break: number;
			duration: number;
		}> = parser.feed(timereport).results[0];
		return { timereport: parsed };
	} catch (parseError) {
		console.log(parseError);
		console.log('Error at character ' + parseError.offset); // "Error at character 9"
		return { error: 'Error at character ' + parseError.offset };
	}
}
