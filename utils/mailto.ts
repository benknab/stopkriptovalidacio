interface MailtoParams {
	to: string[];
	subject?: string;
	body?: string;
}

// RFC 6068 specifies comma-separated CC recipients, but some email clients
// (e.g., Protonmail, mobile clients) don't parse them correctly. As a workaround,
// we put all recipients in the To field instead of using CC.
export function buildMailtoUrl(params: MailtoParams): string | null {
	const { to, subject, body } = params;
	if (to.length === 0) return null;

	let url = `mailto:${to.map(encodeURIComponent).join(",")}`;
	const queryParts: string[] = [];

	if (subject) {
		queryParts.push(`subject=${encodeURIComponent(subject)}`);
	}

	if (body) {
		// RFC 6068 compliant line break handling for mailto URLs
		// 1. Normalize all line endings to \n
		// 2. Replace \n with pre-encoded %0D%0A
		// 3. Encode the result, then undo double-encoding of line breaks
		const normalizedBody = body.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		const bodyWithLineBreaks = normalizedBody.replace(/\n/g, "%0D%0A");
		const encodedBody = encodeURIComponent(bodyWithLineBreaks).replace(/%250D%250A/g, "%0D%0A");
		queryParts.push(`body=${encodedBody}`);
	}

	if (queryParts.length > 0) {
		url += `?${queryParts.join("&")}`;
	}

	return url;
}
