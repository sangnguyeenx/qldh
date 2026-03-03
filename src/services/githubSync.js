// ── Crypto: AES-256-GCM via Web Crypto API ─────────────────────────────────
const SALT = new TextEncoder().encode('qldh-app-v1-salt')

async function deriveKey(pat) {
    const raw = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(pat),
        'PBKDF2', false, ['deriveKey']
    )
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: SALT, iterations: 100_000, hash: 'SHA-256' },
        raw,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

export async function encryptJSON(obj, pat) {
    const key = await deriveKey(pat)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(JSON.stringify(obj))
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.byteLength)
    return btoa(String.fromCharCode(...combined))
}

export async function decryptJSON(base64, pat) {
    const key = await deriveKey(pat)
    const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const iv = combined.slice(0, 12)
    const data = combined.slice(12)
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    return JSON.parse(new TextDecoder().decode(decrypted))
}

// ── GitHub API ──────────────────────────────────────────────────────────────
const REPO = 'sangnguyeenx/qldh'
const FILE = 'user-settings.enc'
const API = `https://api.github.com/repos/${REPO}/contents/${FILE}`

function ghHeaders(pat) {
    return {
        Authorization: `token ${pat}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    }
}

/** Đọc file từ GitHub, trả về { encContent, sha } hoặc null nếu chưa có */
export async function ghRead(pat) {
    const res = await fetch(API, { headers: ghHeaders(pat) })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`GitHub read error: ${res.status}`)
    const json = await res.json()
    return {
        encContent: atob(json.content.replace(/\n/g, '')),
        sha: json.sha,
    }
}

/** Ghi file lên GitHub (tạo mới hoặc update) */
export async function ghWrite(pat, encContent, sha) {
    const body = {
        message: `sync: update settings ${new Date().toISOString()}`,
        content: btoa(encContent),
        ...(sha ? { sha } : {}),
    }
    const res = await fetch(API, {
        method: 'PUT',
        headers: ghHeaders(pat),
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `GitHub write error: ${res.status}`)
    }
    const data = await res.json()
    return data.content.sha
}

// ── High-level helpers ──────────────────────────────────────────────────────

/** Load settings từ GitHub, decrypt bằng PAT. Trả về { settings, sha } */
export async function loadRemoteSettings(pat) {
    const result = await ghRead(pat)
    if (!result) return null
    const settings = await decryptJSON(result.encContent, pat)
    return { settings, sha: result.sha }
}

/** Encrypt và lưu settings lên GitHub */
export async function saveRemoteSettings(pat, settings, sha) {
    const enc = await encryptJSON(settings, pat)
    const newSha = await ghWrite(pat, enc, sha)
    return newSha
}
