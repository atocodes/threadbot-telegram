export function convertTo2DArray<T>(array: T[]) {
  if (array.length == 1 || array.length == 0) {
    return [array];
  }
  var res: T[][] = [];
  let row: T[] = [];
  array.forEach((item, idx) => {
    row.push(item);
    if (idx == array.length - 1 && array.length % 2 > 0) {
      res.push(row);
    } else if (idx % 2 != 0) {
      res.push(row);
      row = [];
    }
  });

  return res;
}

