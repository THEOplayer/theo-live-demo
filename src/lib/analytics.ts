export const sendLatencyAnalytics = (
	endpoint: string | undefined,
	code: string,
	sessionId: string,
	channelId: string,
	engineLatency: number,
	distributionLatency: number | undefined,
	bufferLatency: number
): void => {
	if (endpoint === undefined || code === undefined) {
		return
	}

	fetch(`${endpoint}stats`, {
		method: 'POST',
		body: JSON.stringify({
			type: 'latencymeasurement',
			currentTime: new Date().getTime() / 1000,
			sessionId,
			channelId,
			extra: {
				engine: engineLatency,
				distribution: distributionLatency,
				buffer: bufferLatency
			}
		})
	}).catch(console.error)
}
