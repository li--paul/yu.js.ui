import convertToCamelCase from '../common/tool'

export default class YuComponent {
    states = {}

    node = {}

    mounted = false

    init(component, states) {
      this.initNode(component)
      this.initStates(states)
    }

    initNode(component) {
      this.node = typeof component === 'string' ? document.querySelector(component) : component
      // attributes只是为了方便组件初始化，改变attributes不能改变state
      this.states = this.parseAttributesToStates(this.node.attributes)
    }

    initStates(states) {
      // states优先于attributes
      this.states = Object.assign(this.defaultStates || {}, this.states, states || {})
      this.setStates(this.states)
      this.node.setAttribute('mounted', '')
      this.mounted = true
    }

    setState(stateName, value) {
      if (this[stateName]) {
        this[stateName](value)
        this.states[stateName] = value
      }
    }

    setStates(states) {
      for (const key of Object.keys(states)) {
        this.setState(key, states[key])
      }
    }

    parseAttributesToStates = (attributes) => {
      const states = {}

      Array.from(attributes).forEach((item) => {
        if (item.name.indexOf(':') === 0) {
          this.node.removeAttribute(item.name)
          const name = convertToCamelCase(item.name.substr(1))
          const start = item.value[0]
          if (item.value === '') {
            states[name] = true
            return
          }

          if (start === '{' || start === '[') {
            states[name] = JSON.parse(item.value)
            return
          }

          // 可以有负号，可以是整数，可以是小数, 如果带有其他字符，则按字符串处理
          if (/[-?0-9]/.test(start)) {
            const num = Number(item.value)
            if (isNaN(num)) {
              states[name] = item.value
            } else {
              states[name] = num
            }
            return
          }

          if (item.value === 'true' || item.value === 'false') {
            states[name] = item.value === 'true'
            return
          }

          if (start === '$') {
            states[name] = yu.data[item.value.substr(1)]
            return
          }

          states[name] = item.value
        }

        // 绑定事件
        if (item.name.indexOf('@') === 0) {
          this.node.removeAttribute(item.name)
          const eventName = `on${item.name[1].toLocaleUpperCase()}${item.name.substr(2)}`
          this[eventName] = yu.data[item.value.substr(1)]
        }
      })
      return states
    }

    // 触发事件
    emit(eventName, ...args) {
      if (this[eventName]) {
        this[eventName](...args)
      }
    }
}
