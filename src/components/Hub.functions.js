import { getGlobalColors } from "../functions"



let data = {
  piece : {
    selected : false,
    index : 0
  }
}

export function setInitialData() {
  data = {
    piece : {
      selected : false,
      index : 0
    }
  }
  return data
}


export function handleDirectionEvent(dir) {
  if (!data.piece.selected) {
    if (dir % 2 === 1) {
      let resp = setActivePiece(data.piece.index + (2 - dir))
      if (! resp) {
        return null
      }
    }
  }
  return data
}

function setActivePiece(index) {
  if (index >= 0 && index < getGlobalColors().length) {
    data.piece = {
      selected : false,
      index : index
    }
    return true
  }
  return false
}

export function getPieceData() {
  console.log(data.piece);
  return data.piece
}


export function handleSelectedEvent() {
  if (!data.piece.selected) {
    data.piece.selected = true
  }
  return data.piece
}