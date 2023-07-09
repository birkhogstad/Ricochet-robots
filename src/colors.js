
const colorValues = [
  [0, 0, 255],
  [255, 0, 0],
  [0, 255, 0],
  [255, 255, 0],
]


function getColorValues(id) {
  let c = {
    high : 255,
    low : 0,
  }
  switch (id) {
    case 0:       // ROBOT
      c.low = 140
      break;
    case 1:       // DEFAULT TILE MOVE CONNECTOR
      c.low = 210
      break;
    case 2:       // DEFAULT TILE MOVE END
      c.low = 170
      break;
    case 3:       // TARGET
      c.low = 30
      break;
  
    default:
      break;
  }
  return c
}

function getRobotColorArray() {
  let v = getColorValues(0)
  console.log(v);
  let arr = []
  for (let i = 0; i < colorValues.length; i++) {
    arr.push(getRobotColor(i))
  }
  return arr
}

export function getMoveColorString(colorId) {
  return {
    middle : rgbString(setOuterValues(colorValues[colorId], getColorValues(1))),
    end : rgbString(setOuterValues(colorValues[colorId], getColorValues(2))),
  }
}

function setOuterValues(arr = [], outer = null) {
  if (outer === null) {
    return
  }
  return arr.map((v) => Math.max(outer.low, Math.min(outer.high, v)));
}

function limit(id, low = 0, high = 100) {
  return rgbString(colorValues[id].map((c) => (Math.max(low, Math.min(high, c)))))
}

export function getRobotColor(colorId) {
  return rgbString(setOuterValues(colorValues[colorId], getColorValues(0)))
}

export function getColor(id, low = 0, high = 255) {
  return limit(id, low, high)
}

export function getOuterColorId(colorId, k) {
  return rgbString(setOuterValues(colorValues[colorId], getColorValues(k)))
}

export function colorScaleValues(count, paths) {
  let c = {
    low : 230,
    high : 255,
  }
  let i = {
    low : -3,
    high : 0,
  }
  paths.map((p) => {
    let d = getColor(p.pieceId, c.low + (i.low * 5), c.high + (i.high * 5))
    let m = [d]
    while (m.length + 1 !== p.tiles.length) {
      m.push(getColor(p.pieceId, c.low , c.high))
      Object.keys(c).map((k) => {
        c[k] += i[k]

      })
      if (c.low < 100) {
        c.low = 100
        i.low = 0
        i.high = -2
      }
      if (c.high < 100) {
        c.high = 100
        i.high = 0
      }
    }
    m.push(getColor(p.pieceId, c.low + (i.low * 5), c.high + (i.high * 5)))
    p.colors = m

  })
  return paths
}



function rgbString(arr) {
  let r = arr[0]
  let g = arr[1]
  let b = arr[2]
  return 'rgb(' + r + ', ' + g + ', ' + b  + ')'
}

