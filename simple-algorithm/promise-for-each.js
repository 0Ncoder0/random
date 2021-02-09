
Array.prototype.forEachSync = async function (cb) {
  for (let i = 0; i < this.length; i++) {
    await cb(this[i]);
  }
  return;
};

Array.prototype.forEachSyncAll = async function (cb) {
  let count = this.length;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < this.length; i++) {
      new Promise(async res => {
        await cb(this[i]);
        res(true);
      })
        .then(() => {
          if (count === 0) resolve(true);
          count--;
        })
        .catch(reject);
    }
  });
};

await [1, 2, 3, 4, 5].forEach(
  async i =>
    await new Promise(res => {
      setTimeout(() => (console.log(i), res()), Math.random() * 1000);
    })
);
console.log("end:forEach");

await [1, 2, 3, 4, 5].forEachSync(
  async i =>
    await new Promise(res => {
      setTimeout(() => (console.log(i), res(true)), Math.random() * 1000);
    })
);
console.log("end:forEachSync");

await [1, 2, 3, 4, 5].forEachSyncAll(
  async i =>
    await new Promise(res => {
      setTimeout(() => (console.log(i), res(true)), Math.random() * 1000);
    })
);
console.log("end:forEachSyncAll");
