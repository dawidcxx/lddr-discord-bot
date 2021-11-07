export function arrayChunk<T>(src: Array<T>, chunkSize: number): Array<T[]> {
  const result: Array<T[]> = []
  let rowBuilder: Array<T> = []
  let counter: number = 0

  for (let index = 0; index < src.length; index++) {
    const element = src[index]
    rowBuilder.push(element)
    if (counter === chunkSize - 1) {
      result.push(rowBuilder.splice(0, rowBuilder.length))
      counter = 0
    } else {
      counter += 1
    }
  }

  return result
}
