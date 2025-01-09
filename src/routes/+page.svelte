<script lang="ts">
	import Player from '$lib/Player.svelte'
	import Timeline from '$lib/Timeline.svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import Stats from '$lib/Stats.svelte'

	let channelId = $derived(
		browser ? new URLSearchParams(window.location.search).get('channel')! : undefined
	)

	$effect(() => {
		if (browser && !channelId) {
			goto('?channel=ar5c53uzm3si4h4zgkzrju44h')
		}
	})
</script>

<main class="container-fluid">
	<header>
		<p class="channel">{channelId}</p>
		<Timeline />
	</header>
	<footer>
		<Stats />
	</footer>
	<Player channel={channelId} />
</main>

<style lang="css">
	.container-fluid {
		position: absolute;
		width: 100%;
		height: 100%;
		padding: 0px;
	}
	header,
	footer {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 1000;
	}
	header {
		top: 0;
		display: flex;
		justify-content: space-between;
	}
	.channel {
		position: absolute;
		opacity: 0.6;
		font-weight: 400;
		padding: 4px;
		border-radius: 4px;
		margin: 1em;
	}
	footer {
		bottom: 0;
	}
</style>
