<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte'
	import { Player, version } from 'theoplayer'
	import Page from '../routes/+page.svelte'

	let player: Player | undefined = $state()

	let qualities: string[] = $state([])
	let activeQuality: string | undefined = $state()
	interface Props {
		channel: string | undefined;
		class?: string;
	}

	let { channel, class: className = '' }: Props = $props();
	let latency: string | undefined = $state('0')
	

	onMount(() => {
		if (window.player) player = window.player

		// Because this keeps on changing, and there's no event listener for this, we need to evaluate this at an interval
		const interval = setInterval(() => {
			latency = `${player?.latency?.currentLatency?.toFixed(2) ?? '<1'}s`
		}, 1000)
		return () => clearInterval(interval)
	})

	run(() => {
		if (player) {
			const { videoTracks } = player as any
			videoTracks.addEventListener('addtrack', ({ track }: any) => {
				qualities = track.qualities.map((q: any) => q.id)
				track.addEventListener('activequalitychanged', ({ quality }: any) => {
					activeQuality = quality?.id
				})
			})
			videoTracks.addEventListener('removetrack', () => {
				qualities = []
			})
		}
	});
</script>

<article class="{className} translucent">
	<table>
		<tbody>
			<tr>
				<th scope="row">Player version</th>
				<td>{version ?? ''}</td>
			</tr>
			<tr>
				<th scope="row">Channel</th>
				<td aria-busy={!channel}>{channel ?? ''}</td>
			</tr>
			<tr>
				<th scope="row">Qualities</th>
				<td class="qualities" aria-busy={qualities.length === 0}>
					{#each qualities as quality}
						<div class:selected={quality === activeQuality}>{quality}</div>
					{/each}
				</td>
			</tr>
			<tr>
				<th scope="row">Target latency</th>
				<td>{latency}</td>
			</tr>
		</tbody>
	</table>
</article>

<style>
	article {
		flex: 1 1 200px;
		padding: 0;
		overflow: auto;
	}

	table {
		margin: 0;
	}

	.selected {
		position: relative;
	}

	.selected::before {
		background: #ffc713;
		content: '';
		display: block;
		border-radius: 4px;
		height: 3px;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.qualities {
		display: flex;
		flex-direction: column;
		align-items: start;
		min-height: 2rem;
		& > div {
			margin-left: -0.2rem;
			padding: 0.2rem;
		}
	}
</style>
