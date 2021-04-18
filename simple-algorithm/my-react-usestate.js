/**
 * 用 hook 模拟 React 中的 useState
 *
 * 1. hook 中根据下标 this.index 读取当前 this 中已存的数据 value = this.store[this.index]
 * 2. hook 如无已存的数据，则会将传入的值保存到 this.store[this.index] = value
 * 3. 更新下标 this.index++ 使下一次执行 hook 时可按顺序定位到另一个数据 this.store[this.index]
 * 4. 返回当前数据和修改数据的方法 [value,setValue]，并且修改数据的方法会触发父组件的渲染 this.parent.triggerRender 以达到更新此组件的效果
 */
let hook = function (value) {
  const { index, store, parent } = this

  if (store.hasOwnProperty(index)) {
    value = store[index]
  } else {
    store[index] = value
  }

  const setValue = value => {
    store[index] = value
    parent.triggerRender()
  }

  this.index++

  return [value, setValue]
}

/**
 * 用 VNode 模拟 React 中的虚拟节点
 * children : 虚拟节点列表，保存 render 和 hook 使用的存储空间的 { index:-1 , store:[] } 和当前组件的指向 { parent:this }
 * addComponent : 模拟添加新组件的过程，并初始化 hook 的存储空间 并将父组件的指向自己
 * called : 保存 render 是否被触发
 * triggerRender : 如果 render 未被触发则将 render 函数推到任务执行的队尾(使用 setTimeout 模拟) 
 * render :
 *  1. 遍历子节点列表
 *  2. 重置 hook 的存储空间的下标值
 *  3. 绑定 hook 方法的 this 到即将要渲染的虚拟节点中
 *  4. 执行虚拟节点的渲染函数
 */
class VNode {
  children = []
  addComponent = render => this.children.push({ index: -1, store: [], render, parent: this })

  called = false
  triggerRender() {
    if (this.called) return
    this.called = true
    setTimeout(() => {
      this.render()
      this.called = false
    })
  }

  render() {
    this.children.forEach(vnode => {
      hook = hook.bind(vnode)
      vnode.index = 0
      vnode.render()
    })
  }
}

/**
 * 模拟 React 中的组件
 * 1. 使用 hook(0) 拿到数据和更新数据的方法 [count,setCount] [decount,setDecount]
 * 2. 设置定时器使 count 每秒 +1 / decount 每秒 -1
 * 3. console.log 假装我们渲染了页面
 */
const Counter = () => {
  const [count, setCount] = hook(0)
  const [decount, setDecount] = hook(0)
  setTimeout(() => {
    setCount(count + 1)
    setDecount(decount - 1)
  }, 1000)
  console.log(`count:${count} decount:${decount}`)
}

// 实例化 -> 添加组件 -> 执行渲染函数
const app = new VNode()
app.addComponent(Counter)
app.render()
