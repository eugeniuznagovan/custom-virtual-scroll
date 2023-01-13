import { TcVirtualScrollTypes } from './tc-virtual-scroll.types';

import Settings = TcVirtualScrollTypes.Settings;
import State = TcVirtualScrollTypes.State;

export namespace TcVirtualScrollFns {
  export function getData(settings: Readonly<Settings>, offset: number, limit: number) {
    const {minIndex, maxIndex} = settings;

    const data = [];
    const start = Math.max(minIndex, offset);
    const end = Math.min(offset + limit - 1, maxIndex);

    if (start <= end) {
      for (let i = start; i <= end; i++) {
        data.push({index: i, text: `item ${i}`});
      }
    }

    return data;
  }

  export function initState(settings: Settings): State {
    const {amount, itemHeight, maxIndex, minIndex, tolerance, startIndex} = settings

    // 1) height of the visible part of the viewport (px)
    const viewportHeight = amount * itemHeight
    // 2) total height of rendered and virtualized items (px)
    const totalHeight = (maxIndex - minIndex + 1) * itemHeight
    // 3) single viewport outlet height, filled with rendered but invisible rows (px)
    const toleranceHeight = tolerance * itemHeight
    // 4) all rendered rows height, visible part + invisible outlets (px)
    const bufferHeight = viewportHeight + 2 * toleranceHeight
    // 5) number of items to be rendered, buffered dataset length (pcs)
    const bufferedItems = amount + 2 * tolerance
    // 6) how many items will be virtualized above (pcs)
    const itemsAbove = startIndex - tolerance - minIndex
    // 7) initial height of the top padding element (px)
    const topPaddingHeight = itemsAbove * itemHeight
    // 8) initial height of the bottom padding element (px)
    const bottomPaddingHeight = totalHeight - topPaddingHeight
    // 9) initial scroll position (px)
    const initialScrollPosition = topPaddingHeight + toleranceHeight + itemHeight

    return {
      settings,
      viewportHeight,
      totalHeight,
      toleranceHeight,
      bufferHeight,
      bufferedItems,
      topPaddingHeight,
      bottomPaddingHeight,
      initialScrollPosition,
      data: []
    }
  }

  export function updateState(state: Readonly<State>) {
    return (scrollPosition: number) => {
      const {totalHeight, toleranceHeight, bufferedItems, settings} = state;
      const {itemHeight, minIndex} = settings;

      const index = minIndex + Math.floor((scrollPosition - toleranceHeight) / itemHeight);
      const data = getData(settings, index, bufferedItems);
      const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0)
      const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * itemHeight, 0);

      return {
        topPaddingHeight,
        bottomPaddingHeight,
        data
      };
    }
  }
}
