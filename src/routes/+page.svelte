<script lang="ts">
	import PlayerView from '$lib/PlayerView.svelte'
	import Timeline from '$lib/Timeline.svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import Stats from '$lib/Stats.svelte'
	import { onMount } from 'svelte'
	import type { Endpoint, EndpointLoadedEvent, Player } from 'theoplayer'

	let endpoint: Endpoint | undefined = $state(undefined)
	let src: string | undefined = $state(undefined)
	let player: Player | undefined = $state(undefined)
	let authToken: string | undefined = $state()

	onMount(() => {
		if (!browser) return
		const searchParams = new URLSearchParams(page.url.searchParams)
		if (!searchParams.has('channel') && !searchParams.has('distribution')) {
			goto('?channel=ar5c53uzm3si4h4zgkzrju44h')
		}
	})

	$effect(() => {
		if (!browser) return
		const searchParams = new URLSearchParams(page.url.searchParams)
		src = searchParams.get('distribution') ?? searchParams.get('channel') ?? undefined
		authToken = searchParams.get('authToken') ?? undefined
	})

	function onEndpointLoaded(event: EndpointLoadedEvent) {
		console.log('Endpoint loaded', event)
		endpoint = event.endpoint
	}

	$effect(() => {
		if (!player) return
		player.theoLive!.addEventListener('endpointloaded', onEndpointLoaded)
		return () => {
			player?.theoLive!.removeEventListener('endpointloaded', onEndpointLoaded)
		}
	})
</script>

<svelte:head>
	<title>OptiView Live demo</title>
	<meta name="description" content="THEOLive demo" />
</svelte:head>

<main>
	<PlayerView {src} {authToken} bind:player />
	<footer>
		<Stats {endpoint} {player} />
		<Timeline {player} />
	</footer>
</main>

<style lang="css">
	main {
		width: 100%;
	}

	@media screen and (min-width: 600px) {
		main {
			height: 100%;
		}

		footer {
			position: absolute;
			left: 0;
			right: 0;
			z-index: 1;
		}

		footer {
			bottom: 3rem;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: 1rem;
			overflow-x: hidden;
		}
	}
</style>
