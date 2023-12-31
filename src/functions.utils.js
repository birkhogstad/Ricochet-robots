

export const rowLength = 16

export const centerTileIds = [119, 120, 135, 136]

export const lightColors = ['lightblue', 'lightcoral', 'lightgreen', 'lightyellow']


export let robots = 4;


export let live = false
export let roundMoves = null

const col = [

  [0, 0, 255],
  [255, 0, 0],
  [0, 255, 0],
  [255, 255, 0],
]


export function getNextOffset() {
  return [- rowLength, 1, rowLength, -1]
}


export function getColorBase(index) {
  return col[index]
}

export function toggleLive() {
  live = live === false
}




export function getColorStrength(index, str = 0, parts = 10) {
  let arr = []
  getColorBase(index).map((c) => {
    arr.push(Math.min(255, Math.ceil(str * (255 / parts)) + c))
  })
  return getColorString(arr)  
}

export function getTargetPropSides(index) {
  let arr = []
  getColorBase(index).map((c) => {
    arr.push(Math.max(20 , (c + 1) / 2))
  })
  return getColorString(arr)
}


export function getPieceColor(index) {
  return getColorStrength(index, 6)
}


function getColorString(arr) {
  let r = arr[0]
  let g = arr[1]
  let b = arr[2]
  return 'rgb(' + r + ', ' + g + ', ' + b  + ')'
}



