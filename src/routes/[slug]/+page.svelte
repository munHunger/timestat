<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const fullWorkDayInMinutes = 8 * 60;

	function getFlexDiff(worked: number) {
		return worked - fullWorkDayInMinutes;
	}
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	function dayEnding(number: number): string {
		switch (number) {
			case 21:
			case 31:
			case 1:
				return 'st';
			case 22:
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	}
	function shortDate(date: any) {
		return monthNames[date.month - 1].substring(0, 3) + ' ' + date.day + dayEnding(date.day);
	}

	function getFlex(): number {
		if (data.timereport)
			return data.timereport.reduce((acc, val) => acc + getFlexDiff(val.duration), 0);
		else return 0;
	}
</script>

{#if data.timereport}
	<div class="my-8 flex flex-col items-center">
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="inline-block w-8 h-8 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
						/>
					</svg>
				</div>
				<div class="stat-title">Total Hours</div>
				<div class="stat-value">
					{data.timereport.reduce((acc, val) => acc + val.duration / 60, 0).toFixed(2)}
				</div>
				<div class="stat-desc">
					{shortDate(data.timereport[data.timereport.length - 1].date)} -
					{shortDate(data.timereport[0].date)}
				</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="inline-block w-8 h-8 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
						/>
					</svg>
				</div>
				<div class="stat-title">Total Days</div>
				<div class="stat-value">{data.timereport.length}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="inline-block w-8 h-8 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
						/>
					</svg>
				</div>
				<div class="stat-title">Flex</div>
				<div class="stat-value">
					{getFlex()}
				</div>
				<div class="stat-desc">
					{getFlexDiff(data.timereport[0].duration) < 0 ? '↘︎' : '↗︎'}
					{getFlexDiff(data.timereport[0].duration)} ({(
						(getFlex() - getFlexDiff(data.timereport[0].duration)) /
						getFlex()
					).toFixed(2)}%)
				</div>
			</div>
		</div>
	</div>
{/if}
<div class="p-4 flex flex-col items-center">
	{#if data.timereport}
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
					{#each data.timereport.filter((v) => v.date) as timeEntry}
						<tr>
							<th
								>{timeEntry.date.year}-{('' + timeEntry.date.month).padStart(2, '0')}-{(
									'' + timeEntry.date.day
								).padStart(2, '0')}</th
							>
							<td>
								{(timeEntry.start || {}).hours}:
								{('' + (timeEntry.start || {}).minutes).padStart(2, '0')}
							</td>

							<td>
								{(timeEntry.end || {}).hours}:
								{('' + (timeEntry.end || {}).minutes).padStart(2, '0')}
							</td>
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
