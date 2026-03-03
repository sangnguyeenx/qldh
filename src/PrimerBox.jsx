/**
 * Compatibility shim: provides a Box-like component using inline styles
 * so we can use sx-style props similar to Primer v36 API
 * while using Primer v38 under the hood.
 */
import styled from 'styled-components'

// A simple Box powered by styled-components that accepts sx as a style object
export const Box = styled.div(({ sx = {} }) => ({
    ...flattenSx(sx),
}))

function flattenSx(sx) {
    // Simple flatten: pick non-responsive values
    const skip = ['&:hover', '&:last-child', '&:first-child', '&:active']
    const result = {}
    for (const [key, val] of Object.entries(sx)) {
        if (skip.some(s => key.startsWith('&'))) continue
        if (Array.isArray(val)) {
            result[cssKey(key)] = val[0] // mobile first
        } else if (typeof val === 'object' && val !== null) {
            // nested (e.g. responsive) — skip
        } else {
            result[cssKey(key)] = mapToken(key, val)
        }
    }
    return result
}

// Map Primer design tokens to actual CSS values
const SPACE = { 0: 0, 1: '4px', 2: '8px', 3: '16px', 4: '24px', 5: '32px', 6: '40px', 7: '48px', 8: '64px' }
const FONT_SIZES = { 0: '12px', 1: '14px', 2: '16px', 3: '20px', 4: '24px', 5: '32px', 6: '40px' }
const RADII = { 0: 0, 1: '3px', 2: '6px', 3: '12px' }

function mapToken(key, val) {
    const spaceKeys = ['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
        'marginX', 'marginY', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
        'paddingX', 'paddingY', 'mt', 'mb', 'ml', 'mr', 'mx', 'my', 'pt', 'pb', 'pl', 'pr', 'px', 'py',
        'p', 'm', 'gap', 'rowGap', 'columnGap', 'top', 'left', 'right', 'bottom',
        'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight']

    if (spaceKeys.includes(key) && typeof val === 'number' && SPACE[val] !== undefined) {
        return SPACE[val]
    }
    if (key === 'fontSize' && FONT_SIZES[val] !== undefined) return FONT_SIZES[val]
    if (key === 'borderRadius' && RADII[val] !== undefined) return RADII[val]

    // Color tokens mapping
    const colorMap = {
        'canvas.default': '#ffffff',
        'canvas.subtle': '#f6f8fa',
        'canvas.inset': '#f0f6ff',
        'border.default': '#d0d7de',
        'border.muted': '#d8dee4',
        'fg.default': '#1f2328',
        'fg.muted': '#59636e',
        'fg.subtle': '#818b98',
        'fg.onEmphasis': '#ffffff',
        'accent.fg': '#0969da',
        'accent.subtle': '#ddf4ff',
        'accent.emphasis': '#0969da',
        'success.fg': '#1a7f37',
        'success.subtle': '#dafbe1',
        'success.emphasis': '#1f883d',
        'danger.fg': '#cf222e',
        'danger.subtle': '#fff0ee',
        'danger.emphasis': '#cf222e',
        'attention.fg': '#9a6700',
        'attention.subtle': '#fff8c5',
        'attention.emphasis': '#d1a804',
        'done.fg': '#8250df',
        'done.subtle': '#fbefff',
        'severe.fg': '#bc4c00',
    }

    const colorKeys = ['color', 'bg', 'backgroundColor', 'borderColor', 'fill', 'stroke']
    if (colorKeys.includes(key) && colorMap[val]) return colorMap[val]

    // Box shadows
    if (key === 'boxShadow') {
        const shadows = {
            'shadow.small': '0 1px 0 rgba(31,35,40,0.04)',
            'shadow.medium': '0 3px 6px rgba(31,35,40,0.12)',
            'shadow.large': '0 8px 24px rgba(31,35,40,0.12)',
        }
        if (shadows[val]) return shadows[val]
    }

    return val
}

function cssKey(key) {
    // shorthand mappings
    const map = {
        bg: 'backgroundColor',
        mt: 'marginTop', mb: 'marginBottom', ml: 'marginLeft', mr: 'marginRight',
        mx: undefined, my: undefined, // handled separately
        pt: 'paddingTop', pb: 'paddingBottom', pl: 'paddingLeft', pr: 'paddingRight',
        px: undefined, py: undefined,
        p: 'padding', m: 'margin',
    }
    if (map[key] !== undefined) return map[key] || key
    // camelCase to CSS (no change needed for styled-components)
    return key
}
