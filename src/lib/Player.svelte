<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { Player } from 'theoplayer'
	import { LICENSE } from '$lib/license'
	import 'theoplayer/ui.css'

	interface Props {
		channel: string | undefined
		onPause?: () => void
		onPlaying?: () => void
	}

	let { channel, onPause, onPlaying }: Props = $props()
	let playerElement: HTMLElement | undefined = $state()
	let player: Player | undefined

	onMount(() => {
		if (player) return

		const newPlayer = new Player(playerElement!, {
			license: LICENSE,
			mutedAutoplay: 'all',
			retryConfiguration: { maxRetries: 6 }
		})
		newPlayer.autoplay = true
		newPlayer.muted = true
		window.player = newPlayer
		player = newPlayer
		if (onPause) {
			newPlayer.addEventListener('pause', onPause)
		}
		if (onPlaying) {
			newPlayer.addEventListener('playing', onPlaying)
		}
		player.source = {
			sources: {
				src: channel,
				integration: 'theolive'
			}
		}
	})

	onDestroy(() => {
		if (player) {
			player.destroy()
			player = undefined
		}
	})
</script>

<div id="player" bind:this={playerElement} class="player-container video-js theoplayer-skin"></div>

<style>
	.player-container {
		height: 100%;
		width: 100%;
	}
</style>
