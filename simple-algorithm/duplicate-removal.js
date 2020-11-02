/**
 * 去重
 * @param {any[]} arr 数组
 * @param {Function} isEqual (a,b)=>isEqual
 */
const duplicateRemoval = (arr, isEqual) => {
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

/**
 * 去重
 * @param {any[]} arr 数组
 * @param {Function} hash (a)=>hash
 */
const duplicateRemoval_hash = (arr, hash) => {
  const hashMap = {}
  const output = []
  for (let i = 0; i < arr.length; i++) {
    hashMap[hash(arr[i])] = arr[i]
  }
  for (let h in hashMap) {
    output.push(hashMap[h])
  }
  return output
}
