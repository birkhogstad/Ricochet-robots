

export const rowLength = 16

export const centerTileIds = [119, 120, 135, 136]

export const colors = ['blue', 'red', 'green', 'yellow']
export const lightColors = ['lightblue', 'lightcoral', 'lightgreen', 'lightyellow']


export function getNextOffset() {
  return [- rowLength, 1, rowLength, -1]
}


