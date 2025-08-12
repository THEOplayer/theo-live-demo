<script lang="ts">
	import { page } from '$app/state'
	import { onDestroy, onMount } from 'svelte'
	import { Player, type TheoLiveConfiguration } from 'theoplayer'
	import { LICENSE } from '$lib/license'
	import 'theoplayer/ui.css'

	interface Props {
		src: string | undefined
		player: Player | undefined
	}

	let { src, player = $bindable() }: Props = $props()
	let playerElement: HTMLElement | undefined = $state()

	onMount(() => {
		if (player || !playerElement) return
		const params = new URLSearchParams(page.url.searchParams)
		player = new Player(playerElement, {
			license: LICENSE,
			mutedAutoplay: 'all',
			ui: {
				fluid: true
			},
			theoLive: {
				discoveryUrls: params.has('distribution')
					? ['https://discovery.theo.live/v2/distributions/', 'https://discovery.sneezysparrow.com/v2/distributions/']
					: ['https://discovery.theo.live/channels/', 'https://discovery.sneezysparrow.com/channels/'],
				externalSessionId: params.get('externalSessionId') ?? undefined
			} as TheoLiveConfiguration
		})
		player.autoplay = true
		player.muted = true
		window.player = player
	})

	onDestroy(() => {
		if (player) {
			player.destroy()
			player = undefined
		}
	})

	$effect(() => {
		if (!player) return
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
