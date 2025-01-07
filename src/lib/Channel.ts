export interface Channel {
	id: { id: string }
	name: string
	customization?: { targetLatency?: number }
	source: ChannelSource
}

export interface ChannelSource {
	src: string
	targetLatency?: number
	contentProtection?: unknown
}
