<!-- TO fix 
* Investigate what other stats we can show (currently we aren't seeing any)
* Styling the overlay contents
* Making it open source
-->

<script lang="ts">
	import Player from '$lib/Player.svelte'
	import Timeline from '$lib/Timeline.svelte'

	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import Stats from '$lib/Stats.svelte'

	let player: Player | undefined
	let channelId: string | undefined
	$: channelId = browser ? $page.url.searchParams.get('channel')! : undefined

	$: if (browser && !channelId) {
		goto('?channel=ar5c53uzm3si4h4zgkzrju44h')
	}
</script>

<main class="container-fluid">
	<Player channel={channelId} />

	<div class="overlay">
		<p class="channel">{channelId}</p>
		<Timeline class="timeline" />
		<Stats class="stats" channel={channelId} />
	</div>
</main>

<style>
	:global(html, body) {
		background: black;
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
		display: contents;
		overflow: hidden;
	}

	.container-fluid {
		position: absolute;
		width: 100%;
		height: 100%;
		padding: 0px;
	}

	.overlay {
		z-index: 100;
		position: absolute;
		left: 0;
		top: 0;
		margin: 16px;
		& > .channel {
			position: absolute;
			opacity: 0.35;
			background-color: var(--theoplayer-text-color, #fff);
			font-size: x-large;
			font-weight: bold;
			padding: 4px;
			border-radius: 4px;
		}
		& > .timeline {
			border-radius: 4px;
			position: fixed;
			z-index: 1001;
			opacity: 0.6;
			top: 0px;

			@media screen and (min-width: 768px) {
				top: 0px !important;
				margin: 8px;
				right: 0 !important;
			}

			@media screen and (min-width: 0px) {
				top: 64px;
			}
		}
		& > .stats {
			position: fixed;
			border-radius: 4px;
			z-index: 1001;
			bottom: 0;
			margin-left: 8px;
			margin-bottom: 64px;
			opacity: 0.6;
			left: 0 !important;
		}
	}
</style>
