<script lang="ts">
	// @ts-ignore
	import * as nearley from 'nearley';
	import * as compile from 'nearley/lib/compile';
	import * as generate from 'nearley/lib/generate';
	import * as nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped';
	import grammar from '$lib/grammar.ne?raw';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	interface Time {
		hours: number;
		minutes: number;
	}

	interface Date {
		year: number;
		month: number;
		day: number;
	}

	let parsed: Array<{
		date: Date;
		start: Time;
		end: Time;
		break: number;
		duration: number;
	}>;
	try {
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

		const parser = new nearley.Parser(nearley.Grammar.fromCompiled(compileGrammar(grammar)));
		parsed = parser.feed(data.timereport).results[0];
		console.log(parsed);

		//console.log(grammar);
		// const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
		// parser.feed(data.timereport);
	} catch (parseError) {
		console.log(parseError);
		console.log('Error at character ' + parseError.offset); // "Error at character 9"
	}

	const fullWorkDayInMinutes = 8 * 60;

	function getFlexDiff(worked: number) {
		return worked - fullWorkDayInMinutes;
	}
</script>

{#if parsed}
	<div class="my-8 flex flex-col items-center">
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-8 h-8 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				</div>
				<div class="stat-title">Total Hours</div>
				<div class="stat-value">
					{parsed.reduce((acc, val) => acc + val.duration / 60, 0).toFixed(2)}
				</div>
				<div class="stat-desc">Jan 1st - Feb 1st</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-8 h-8 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
						/></svg
					>
				</div>
				<div class="stat-title">Total Days</div>
				<div class="stat-value">{parsed.length}</div>
				<div class="stat-desc">↗︎ 400 (22%)</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-8 h-8 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
						/></svg
					>
				</div>
				<div class="stat-title">Flex</div>
				<div class="stat-value">
					{parsed.reduce((acc, val) => acc + getFlexDiff(val.duration), 0)}
				</div>
				<div class="stat-desc">↘︎ 90 (14%)</div>
			</div>
		</div>
	</div>
{/if}
<div class="p-4 flex flex-col items-center">
	{#if parsed}
		<div class="overflow-x-auto max-w-4xl">
			<table class="table w-full">
				<!-- head -->
				<thead>
					<tr>
						<th />
						<th>Start</th>
						<th>End</th>
						<th>Break</th>
						<th>Working hours</th>
						<th>Diff</th>
					</tr>
				</thead>
				<tbody>
					{#each parsed.filter((v) => v.date) as timeEntry}
						<tr>
							<th
								>{timeEntry.date.year}-{('' + timeEntry.date.month).padStart(2, '0')}-{(
									'' + timeEntry.date.day
								).padStart(2, '0')}</th
							>
							<td>{(timeEntry.start || {}).hours}:{(timeEntry.start || {}).minutes}</td>
							<td>{(timeEntry.end || {}).hours}:{(timeEntry.end || {}).minutes}</td>
							<td>{timeEntry.break}</td>
							<td>{(timeEntry.duration / 60).toFixed(2)}</td>
							<td>
								{#if getFlexDiff(timeEntry.duration) > 0}
									<span class="text-success">↗︎</span>
								{:else if getFlexDiff(timeEntry.duration) < 0}
									<span class="text-error">↘︎</span>
								{:else}
									&nbsp;
								{/if}
								{getFlexDiff(timeEntry.duration)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
