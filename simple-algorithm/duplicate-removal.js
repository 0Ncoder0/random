/**
 * 去重
 * @param {any[]} arr 数组
 * @param {Function} isEqual (a,b)=>isEqual
 */
const duplicateRemoval = (arr, isEqual) => {
  arr = arr.map(e => e)
  let i, k;
  // 从第二个元素开始遍历
  for (i = 1, k = arr.length - 1; i <= k; i++) {
    // 向前检查是否存在
    for (let j = 0; j < i; j++) {
      // 如果存在重复则与倒数第一个有效值交换,有效值位数减一,下标回退
      if (isEqual(arr[i], arr[j])) {
        let temp = arr[i]
        arr[i] = arr[k]
        arr[k] = temp
        k--
        i--
      }
    }
  }
  return arr.slice(0, k + 1)
}
const arr = [1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 7, 8, 8]
const isEqual = (a, b) => a === b

console.log(arr, isEqual)
