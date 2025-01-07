// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Player } from '@theolive/player/chromeless'

declare global {
	interface Window {
		player?: Player
	}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
