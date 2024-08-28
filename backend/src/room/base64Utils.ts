
const BASE64 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

function encodeBase64(num: number): string {
	if (num === 0) return BASE64[0];
	let encoded = '';
	while (num > 0) {
		encoded = BASE64[num % 64] + encoded;
		num = Math.floor(num / 64);
	}
	return encoded;
}

function decodeBase64(str: string): number {
	let decoded = 0;
	for (let i = 0; i < str.length; i++) {
		decoded = decoded * 64 + BASE64.indexOf(str[i]);
	}
	return decoded;
}

export { encodeBase64, decodeBase64 };