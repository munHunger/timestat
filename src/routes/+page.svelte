<script lang="ts">
	import { goto } from '$app/navigation';

	let gistID: string = '';
	function submit() {
		console.log('navigating to ' + gistID);
		goto('/' + gistID);
	}
</script>

<div class="flex flex-col items-center">
	<div class="form-control my-20">
		<div class="input-group">
			<input type="text" bind:value={gistID} placeholder="Gist ID" class="input input-bordered" />
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
