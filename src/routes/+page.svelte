<script lang="ts">
	import Player from '$lib/Player.svelte'
	import Timeline from '$lib/Timeline.svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import Stats from '$lib/Stats.svelte'

	let overlayVisible = $state(true)
	let player: Player | undefined = $state()

	let channelId = $derived(
		browser ? new URLSearchParams(window.location.search).get('channel')! : undefined
	)

	function handlePause() {
		overlayVisible = true
	}

	function handlePlaying() {
		overlayVisible = false
	}

	$effect(() => {
		if (browser && !channelId) {
			goto('?channel=ar5c53uzm3si4h4zgkzrju44h')
		}
	})
	$effect(() => {
		console.log(overlayVisible)
	})
</script>

<main class="container-fluid">
	<header class:visible={overlayVisible}>
		<p class="channel">{channelId}</p>
		<Timeline class="timeline" />
	</header>
	<footer class:visible={overlayVisible}>
		<Stats />
	</footer>
	<Player channel={channelId} onPause={handlePause} onPlaying={handlePlaying} />
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
		transition: opacity 0.5s 1s;
		z-index: 1000;
	}
	header {
		top: 0;
		display: flex;
		justify-content: space-between;
	}

	footer {
		bottom: 0;
	}

	.visible {
		opacity: 1;
		transition-delay: 0s; /* Apply fade-in effect immediately without delay */
	}
</style>
