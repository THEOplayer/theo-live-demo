<script lang="ts">
	import 'chart.js/auto'
	import 'chartjs-adapter-date-fns'
	import './style.css'
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
