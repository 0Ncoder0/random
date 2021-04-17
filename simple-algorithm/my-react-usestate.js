/**
 * 用 hook 模拟 React 中的 useState
 *
 * 1. hook 中根据下标 this.index 读取当前 this 中已存的数据 this.store[this.index]
 * 2. hook 如无已存的数据，则会将传入的值保存到 this.store[this.index]
 * 3. 更新下标 this.index++ 使下一次执行 hook 时可定位到另一个数据 this.store[this.index]
 * 4. 返回当前数据和修改数据的方法 [value,setValue]，并且修改数据的方法会触发 this.render
 */
let hook = function (value) {
  const storedValue = this.store[this.index]

  value = typeof storedValue === 'undefined' ? value : storedValue

  const setValue = value => {
    this.store[this.index] = value
    this.render()
  }

  this.index++

  return [value, setValue]
}

/**
 * 用 VDOM 模拟 React 中的渲染过程
 * vnodes : 虚拟节点列表，保存 render 和 hook 使用的存储空间的 { index , store }
 * addComponent : 模拟添加新组件的过程，并初始化 hook 的存储空间
 * render :
 *  1. 遍历虚拟节点列表
 *  2. 重置 hook 的存储空间的下标值
 *  3. 绑定 hook 方法的 this 到即将要渲染的虚拟节点中
 *  4. 执行虚拟节点的渲染函数
 */
class VDOM {
  vnodes = []
  addComponent = render => this.vnodes.push({ index: -1, store: [], render })

  render() {
    this.vnodes.forEach(vnode => {
      vnode.index = 0
      hook = hook.bind(vnode)
      vnode.render()
    })
  }
}

/**
 * 模拟 React 中的组件
 * 1. 使用 hook(0) 拿到数据和更新数据的方法 [count,setCount]
 * 2. 设置定时器使 count 可以每秒 +1
 * 3. console.log 假装我们渲染了页面
 */
const Component = () => {
  const [count, setCount] = hook(0)
  setTimeout(() => {
    setCount(count + 1)
  }, 1000)
  console.log(`<div>${count}<div>`)
}

// 初始化 -> 添加组件 -> 执行渲染函数
const vdom = new VDOM()
vdom.addComponent(Component)
vdom.render()
