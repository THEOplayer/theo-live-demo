<script lang="ts">
	import { page } from '$app/state'
	import { onDestroy, onMount } from 'svelte'
	import { Player } from 'theoplayer'
	import { LICENSE } from '$lib/license'
	import 'theoplayer/ui.css'

	interface Props {
		channel: string | undefined
	}

	let { channel }: Props = $props()
	let playerElement: HTMLElement | undefined = $state()
	let player: Player | undefined

	onMount(() => {
		if (player || !playerElement) return
		const params = new URLSearchParams(page.url.searchParams)
		const newPlayer = new Player(playerElement, {
			license: LICENSE,
			mutedAutoplay: 'all',
			retryConfiguration: { maxRetries: 6 },
			ui: {
				fluid: true
			},
			theoLive: {
				externalSessionId: params.get('externalSessionId') ?? undefined
			}
		})
		newPlayer.autoplay = true
		newPlayer.muted = true
		window.player = newPlayer
		player = newPlayer
	})

	onDestroy(() => {
		if (player) {
			player.destroy()
			player = undefined
		}
	})

	$effect(() => {
		if (!player) return
		player.source = {
			sources: {
				src: channel,
				integration: 'theolive'
			}
		}
	})
</script>

<div id="player" bind:this={playerElement} class="player-container video-js theoplayer-skin"></div>

<style>
	.player-container {
		width: 100%;
	}

	@media screen and (min-width: 600px) {
		.player-container {
			height: 100%;
			padding-top: 0;
		}
	}

	/* Makes the player setting menu appear on top of the footer */
	:global(.theo-menu-animation-container) {
		z-index: 100;
	}
</style>
