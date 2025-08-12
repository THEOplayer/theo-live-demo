<script lang="ts">
	import PlayerView from '$lib/PlayerView.svelte'
	import Timeline from '$lib/Timeline.svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import Stats from '$lib/Stats.svelte'
	import { onMount } from 'svelte'
	import type { Player, PublicationLoadedEvent } from 'theoplayer'

	let channelName: string | undefined = $state(undefined)
	let src: string | undefined = $state(undefined)
	let player: Player | undefined = $state(undefined)

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
	})

	function handlePublicationLoaded(event: PublicationLoadedEvent) {
		channelName = event.channelName
	}

	$effect(() => {
		if (!player) return
		player.theoLive!.addEventListener('publicationloaded', handlePublicationLoaded)
		return () => {
			player?.theoLive!.removeEventListener('publicationloaded', handlePublicationLoaded)
		}
	})
</script>

<svelte:head>
	<title>{channelName ?? 'OptiView Live demo'}</title>
	<meta name="description" content="THEOLive demo" />
</svelte:head>

<main>
	<header>
		<h1 class="channel">{channelName}</h1>
	</header>
	<PlayerView {src} bind:player />
	<footer>
		<Stats />
		<Timeline />
	</footer>
</main>

<style lang="css">
	h1 {
		font-weight: 400;
		font-size: 1.5rem;
		margin: 0;
	}

	header {
		padding: 1rem;
	}

	main {
		width: 100%;
	}

	@media screen and (min-width: 600px) {
		main {
			height: 100%;
		}

		header,
		footer {
			position: absolute;
			left: 0;
			right: 0;
			z-index: 1;
		}

		header {
			top: 0;
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
