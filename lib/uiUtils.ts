/**
 * General UI and positioning utilities
 */

export const calculateContextMenuPosition = (
    clientX: number,
    clientY: number,
    isRowSelected: boolean
) => {
    // Estimate dimensions for smart positioning
    const menuWidth = 256; // w-64
    const menuHeight = isRowSelected ? 220 : 420; // safe estimates for row/cell menus

    let x = clientX;
    let y = clientY;

    // Flip horizontal if overflow
    if (x + menuWidth > (typeof window !== 'undefined' ? window.innerWidth : 1000)) {
        x = x - menuWidth;
    }

    // Flip vertical if overflow
    if (y + menuHeight > (typeof window !== 'undefined' ? window.innerHeight : 1000)) {
        y = y - menuHeight;
    }

    return { x, y };
};

export const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        return true;
    }
    return false;
};
