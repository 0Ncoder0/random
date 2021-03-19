## 对 JS 对象更灵活安全的操作

### 基类定义

```js
/** 可JSON化 【不支持数组】*/
class JSONable {
  isJSONable = true

  get keys() {
    return []
  }

  /** 导出对象 */
  toObject() {
    const that = this
    const obj = {}
    const getValue = (obj, key) => {
      const value = obj[key]
      if (value && value.isJSONable === true) {
        return value.toObject()
      } else {
        return value
      }
    }
    that.keys.forEach(key => (obj[key] = getValue(this, key)))
    return obj
  }

  /** 使用对象初始化 */
  fromObject(obj) {
    const that = this
    const setValue = (obj, key, value) => {
      if ([null, undefined, ''].includes(value)) {
        return
      } else if ((obj[key] || {}).isJSONable === true) {
        obj[key].fromObject(value)
      } else {
        obj[key] = value
      }
    }
    that.keys.forEach(key => setValue(this, key, obj[key]))
    return this
  }

  /** 导出JSON字符串 */
  toJSON() {
    return JSON.stringify(this.toObject())
  }

  /** 根据JSON字符串初始化 */
  fromJSON(json) {
    return this.fromObject(JSON.parse(json))
  }
}
```

### 使用例子

```js

class Person extends JSONable {
  lastName = ''
  firstName = ''

  sex = 'U'
  age = 0

  get name() {
    return [this.firstName, this.lastName].join(' ')
  }

  set name(name) {
    const [firstName, lastName] = name.split(' ')
    this.lastName = lastName
    this.firstName = firstName
  }

  get keys() {
    return ['name', 'sex', 'age']
  }
}

class Company extends JSONable {
  name = ''
  employer = new Person()
  __employees = []

  get employees() {
    return this.__employees.map(employee => employee.toObject())
  }

  set employees(employees) {
    this.__employees = employees.map(employee => new Person().fromObject(employee))
  }

  get employeeObjects() {
    const objects = {}
    this.__employees.map(employee => (objects[employee.name] = employee))
    return objects
  }

  get keys() {
    return ['name', 'employer', 'employees']
  }
}

const company = new Company().fromObject({
  name: 'Stark Industry',
  employer: {
    name: 'Tony Stark',
    sex: 'M',
    age: 36
  },
  employees: [
    {
      name: 'Pepper Potts',
      sex: 'F',
      age: 32
    },
    {
      name: 'Happy Hogan',
      sex: 'M',
      age: 41
    }
  ]
})

console.log("Pepper Potts'age is", company.employeeObjects['Pepper Potts'].age) // 32

company.employeeObjects['Happy Hogan'].age += 1

console.log("Happy Hogan'age is", company.employeeObjects['Happy Hogan'].age) // 42

console.log(company.toJSON()) // {"name":"Stark Industry","employer":{"name":"Tony Stark","sex":"M","age":36},"employees":[{"name":"Pepper Potts","sex":"F","age":32},{"name":"Happy Hogan","sex":"M","age":42}]}
```

https://github.com/0Ncoder0/random/blob/develop/simple-algorithm/JSONable.js
