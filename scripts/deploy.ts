import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import assert from 'node:assert/strict'
import * as pack from '../package.json' with { type: 'json' }

import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'
import mime from 'mime'
import {
	CloudFrontClient,
	GetDistributionConfigCommand,
	UpdateDistributionCommand
} from '@aws-sdk/client-cloudfront'

// read vars passed through as env variables and omit the first two since they are just `node` and `scrips/deploy.ts`
const args = process.argv.slice(2)

const cloudFrontClient = new CloudFrontClient()
const s3Client = new S3Client({ region: 'eu-west-3' })
const bucket = args[0]
const cloudFrontId = args[1]
const buildFolder = args[2]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const version = (pack as any).version
const s3Prefix = `${version}/`

console.log(`deploying ${s3Prefix} to ${bucket}`)
await assertS3FolderEmpty()
await uploadFiles(await getFiles(buildFolder))
await updateCloudFrontOriginPath()
console.log('Done: https://demo.theo.live')

// UTIL FUNCTIONS //

async function assertS3FolderEmpty(): Promise<void> {
	const command = new ListObjectsV2Command({ Bucket: bucket, Prefix: s3Prefix, MaxKeys: 1 })
	const response = await s3Client.send(command)
	assert.equal(undefined, response.Contents, `Bucket folder not empty: ${s3Prefix}`)
	console.log(`Bucket folder ${s3Prefix} is empty`)
}

async function getFiles(dir: string): Promise<string[]> {
	console.log(`reading ${dir}`)
	const dirFiles = await fs.readdir(dir, { withFileTypes: true })
	const filePromises = dirFiles.map((file) => {
		const res = path.resolve(dir, file.name)
		if (file.isDirectory()) {
			return getFiles(res)
		} else {
			return res
		}
	})
	const files = await Promise.all(filePromises)
	return Array.prototype.concat(...files) as string[]
}

async function uploadFiles(files: string[]): Promise<void> {
	console.log(`uploading to ${s3Prefix}`)
	await Promise.all(files.map((file) => uploadFile(file)))
	console.log(`${files.length} files uploaded`)
}

async function uploadFile(file: string): Promise<void> {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: s3Prefix + path.relative(buildFolder, file),
		Body: createReadStream(file),
		ContentType: mime.getType(file) ?? '',
		CacheControl: getCacheControl(file)
	})
	await s3Client.send(command)
}

function getCacheControl(file: string) {
	if (file.endsWith('.html')) return 'no-cache'
	return 'public, max-age=86400'
}

async function updateCloudFrontOriginPath() {
	const getConfigCommand = new GetDistributionConfigCommand({ Id: cloudFrontId })
	const getConfigResponse = await cloudFrontClient.send(getConfigCommand)
	const distributionConfig = getConfigResponse.DistributionConfig
	const origins = distributionConfig?.Origins?.Items
	assert.equal(origins?.length, 1, `Expected exactly 1 origin: ${distributionConfig}`)
	origins[0].OriginPath = `/${version}`
	const updateCommand = new UpdateDistributionCommand({
		Id: cloudFrontId,
		DistributionConfig: distributionConfig,
		IfMatch: getConfigResponse.ETag
	})
	await cloudFrontClient.send(updateCommand)
	console.log('Cloudfront updated successfully')
}
