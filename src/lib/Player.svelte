<script lang="ts">
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

		const newPlayer = new Player(playerElement, {
			license: LICENSE,
			mutedAutoplay: 'all',
			retryConfiguration: { maxRetries: 6 }
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
		if (!player) return;
		player.source = {
			sources: {
				src: channel,
				integration: 'theolive'
			}
		};
	})
</script>

<div id="player" bind:this={playerElement} class="player-container video-js theoplayer-skin"></div>

<style>
	.player-container {
		height: 100%;
		width: 100%;
	}
</style>
