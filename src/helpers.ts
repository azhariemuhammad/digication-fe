import { COLUMN_WIDTH, GUTTER_SIZE } from './constants';

export const moduleW2LocalWidth = (moduleW: number) => moduleW * COLUMN_WIDTH - GUTTER_SIZE;
export const moduleX2LocalX = (moduleX: number) => moduleW2LocalWidth(moduleX) + GUTTER_SIZE * 2;
export const moduleY2LocalY = (moduleY: number) => moduleY + GUTTER_SIZE;


export const isColliding = (boundingClientRects, currentBoundingClientRect) => {
    // check if the module is colliding with the other modules
    for (let i = 0; i < boundingClientRects.length; i++) {
        const { top, left, width, height } = currentBoundingClientRect;
        const otherBoundingClientRect = boundingClientRects[i];
        if (otherBoundingClientRect !== currentBoundingClientRect && 
            top < otherBoundingClientRect.bottom && 
            left < otherBoundingClientRect.right && 
            top + height > otherBoundingClientRect.top && 
            left + width > otherBoundingClientRect.left) {
            return otherBoundingClientRect;
        }
    }
    return;
  
}