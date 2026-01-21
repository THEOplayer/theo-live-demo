<script lang="ts">
	import { page } from '$app/state'
	import { onDestroy, onMount } from 'svelte'
	import { Player, type TheoLiveConfiguration } from 'theoplayer'
	import { LICENSE } from '$lib/license'
	import 'theoplayer/ui.css'

	interface Props {
		src?: string
		authToken?: string
		player?: Player
	}

	let { src, authToken, player = $bindable() }: Props = $props()
	let playerElement: HTMLElement | undefined = $state()

	onMount(() => {
		if (player || !playerElement) return
		const searchParams = new URLSearchParams(page.url.searchParams)
		player = new Player(playerElement, {
			license: LICENSE,
			mutedAutoplay: 'all',
			ads: { theoads: true },
			ui: {
				fluid: true
			},
			theoLive: {
				discoveryUrls: ['https://discovery.sneezysparrow.com/v2/distributions/'],
				externalSessionId: searchParams.get('externalSessionId') ?? undefined
			} as TheoLiveConfiguration
		})
		player.autoplay = true
		window.player = player
	})

	onDestroy(() => {
		if (player) {
			player.destroy()
			player = undefined
		}
	})

	$effect(() => {
		if (!player?.theoLive) return
		player.theoLive.authToken = authToken
		if (src) {
			player.source = {
				sources: {
					src,
					type: 'theolive'
				}
			}
		} else {
			player.source = undefined
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
