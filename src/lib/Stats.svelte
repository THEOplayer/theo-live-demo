<script lang="ts">
	import { type Latencies, version } from 'theoplayer/chromeless'

	interface Info {
		rate: number
		latency?: Latencies
		quality?: string
		dimension: string
		targetLatency: number
	}

	let info: Info | null = $state(null)

	$effect(() => {
		const intervalId = setInterval(() => {
			const player = window.player
			const video = document.querySelector('video[src]') as HTMLVideoElement
			if (video && player) {
				info = {
					rate: video.playbackRate,
					latency: player.hesp!.latencies,
					quality: player.videoTracks.item(0).activeQuality?.id,
					dimension: `${video.clientWidth} x ${video.clientHeight}`,
					targetLatency: player.latency.currentConfiguration.targetOffset
				}
			} else {
				info = null
			}
		}, 100)
		return () => clearInterval(intervalId)
	})
</script>

<table class="stats">
	<tbody>
		<tr>
			<th scope="row">Version</th>
			<td>{version}</td>
		</tr>
		{#if info != null}
			<tr>
				<th scope="row">Playback rate</th>
				<td>{info.rate}</td>
			</tr>
			<tr>
				<th scope="row">Engine latency</th>
				<td>{Math.round(1000 * (info.latency?.engine ?? 0))}</td>
			</tr>
			<tr>
				<th scope="row">Distribution latency</th>
				<td>{Math.round(1000 * (info.latency?.distribution ?? 0))}</td>
			</tr>
			<tr>
				<th scope="row">Player latency</th>
				<td>{Math.round(1000 * (info.latency?.player ?? 0))}</td>
			</tr>
			<tr>
				<th scope="row">Target latency</th>
				<td>{Math.round(1000 * info.targetLatency)}</td>
			</tr>
			<tr>
				<th scope="row">Quality</th>
				<td>{info.quality}</td>
			</tr>
			<tr>
				<th scope="row">Dimensions</th>
				<td>{info.dimension}</td>
			</tr>
		{/if}
	</tbody>
</table>

<style>
	table {
		padding: 1rem;
	}

	th {
		text-align: left;
	}

	td {
		text-align: right;
	}
</style>
