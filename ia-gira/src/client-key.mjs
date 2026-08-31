import { isIP } from 'node:net';

const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

export function clientKey(request) {
	const remoteAddress = request.socket?.remoteAddress ?? 'unknown';
	if (!LOOPBACK_ADDRESSES.has(remoteAddress)) return remoteAddress;

	const cloudflareAddress = request.headers?.['cf-connecting-ip'];
	if (typeof cloudflareAddress === 'string' && isIP(cloudflareAddress.trim())) {
		return cloudflareAddress.trim();
	}
	return remoteAddress;
}
