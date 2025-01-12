<script lang="ts">
	import Player from '$lib/Player.svelte'
	import Timeline from '$lib/Timeline.svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import Stats from '$lib/Stats.svelte'
	import { onMount } from 'svelte'

	let channelId: string | undefined = $state(undefined)

	onMount(() => {
		if (!browser) return
		const searchParams = new URLSearchParams(page.url.searchParams)
		if (!searchParams.has('channel')) {
			goto('?channel=ar5c53uzm3si4h4zgkzrju44h')
		}
	})

	$effect(() => {
		if (!browser) return
		const searchParams = new URLSearchParams(page.url.searchParams)
		channelId = searchParams.get('channel') ?? undefined
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
		font-weight: 400;
		padding: 4px;
		border-radius: 4px;
		margin: 1em;
	}
	footer {
		bottom: 0;
	}
</style>
