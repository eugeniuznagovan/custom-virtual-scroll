export namespace TcVirtualScrollTypes {
  export type Settings = {
    minIndex: number,
    maxIndex: number,
    startIndex: number,
    itemHeight: number,
    amount: number,
    tolerance: number,
  }

  export type State = {
    viewportHeight: number
    totalHeight: number
    toleranceHeight: number
    bufferHeight: number
    bufferedItems: number
    topPaddingHeight: number
    bottomPaddingHeight: number
    initialScrollPosition: number
    data: any[],
    settings: Settings
  }
}
