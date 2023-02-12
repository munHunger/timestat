<script lang="ts">
	import { goto } from '$app/navigation';

	let gistID: string = '';
	function submit() {
		console.log('navigating to ' + gistID);
		goto('/' + gistID);
	}
</script>

<div class="flex flex-col items-center">
	<div class="hero min-h-screen bg-base-200">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold text-accent">Welcome to Timestat!</h1>
				<p class="py-6">
					With timestat you can enter your timereporting in a gist at github and present it in a
					human friendly way here.
				</p>

				<p>
					The formatting of your gist is of importance and it should look like this, with each row
					representing an entity/day.
				</p>

				<div class="mockup-code text-left">
					<pre data-prefix="1"><code>yyyy-mm-dd startTime endTime break</code></pre>
				</div>
				<p>
					the break is repeating and you can add however many you want (space separated). here is an
					example of what it can look like
				</p>
				<div class="mockup-code text-left">
					<pre data-prefix="1"><code>2023-02-10 08:10 16:00 10</code></pre>
					<pre data-prefix="2"><code>2023-02-09 08:05 16:50 35</code></pre>
				</div>
				<p>
					You can try it out with my gist or create your own.
					<a href="/e7df4905314d9eeccd137358089b8812">
						<span class="text-accent">e7df4905314d9eeccd137358089b8812</span>
					</a>
				</p>
				<div class="form-control my-20 items-center">
					<div class="input-group w-auto">
						<input
							type="text"
							bind:value={gistID}
							placeholder="Gist ID"
							class="input input-bordered"
						/>
						<button class="btn btn-square" on:click={submit}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/></svg
							>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
