<script lang="ts">
	import { onMount } from 'svelte'
	import { Chart } from 'chart.js'
	import { differenceInMinutes } from 'date-fns/differenceInMinutes'

	let canvasElement: HTMLCanvasElement = $state()
	interface Props {
		class?: string
	}

	let { class: className = '' }: Props = $props()
	let chart: Chart<'bar', number[], Date> | undefined

	onMount(() => {
		const intervalID = setInterval(() => {
			if (!chart) return
			const { datasets } = chart.data
			const labels = chart.data.labels!
			const player = window.player
			if (player && !player.paused) {
				const now = new Date()
				const latencies = player?.hesp?.latencies
				if (latencies) {
					const distribution =
						latencies.distribution !== undefined
							? Math.round(latencies.distribution * 1000)
							: undefined
					const backend = Math.round(latencies.backend * 1000)
					const bufferLatency = Math.round(latencies.player * 1000)
					while (labels.length > 0 && differenceInMinutes(now, labels[0]) >= 1) {
						labels.shift()
						datasets.forEach(({ data }) => data.shift())
					}
					labels.push(now)
					datasets[0].data.push(backend)
					datasets[1].data.push(distribution ?? 0)
					datasets[2].data.push(bufferLatency)
					chart.update()
				}
			}
		}, 500)
		return () => clearInterval(intervalID)
	})

	onMount(() => {
		chart = new Chart(canvasElement, {
			type: 'bar',
			data: {
				labels: [],
				datasets: [
					{ label: 'Backend', data: [], backgroundColor: '#ffc713' },
					{ label: 'Distribution', data: [], backgroundColor: '#1362ff' },
					{ label: 'Player buffer', data: [], backgroundColor: '#344a5e' }
				]
			},
			options: {
				responsive: true,
				plugins: {
					tooltip: { mode: 'x' }
				},
				scales: {
					x: {
						type: 'time',
						time: {
							displayFormats: { second: 'HH:mm:ss' },
							tooltipFormat: 'HH:mm:ss',
							unit: 'second'
						},
						stacked: true
					},
					y: {
						stacked: true
					}
				}
			}
		})
	})
</script>

<article class={className}>
	<h2>Latencies</h2>
	<canvas bind:this={canvasElement}></canvas>
</article>
