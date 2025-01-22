<script lang="ts">
	import 'chart.js/auto'
	import 'chartjs-adapter-date-fns'
	import '../app.css'

	let { children } = $props()
</script>

{@render children()}
