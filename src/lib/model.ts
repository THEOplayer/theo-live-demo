export interface DemoConfiguration {
	readonly channels: DemoChannel[]
	readonly analyticsEndpoint: string
	readonly security: Security
}

export interface DemoChannel {
	readonly channelId: string
	readonly discoveryURL: string
}

export interface Security {
	readonly jwtUrl?: string
}

export async function getConfig(code: string): Promise<DemoConfiguration> {
	const response = await fetch(`https://d2aj9c3pn3r0cl.cloudfront.net/configs/${code}`)
	return response.json()
}
