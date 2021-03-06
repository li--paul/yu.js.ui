import YuComponent from '../util/component'

export default class YuSwitch extends YuComponent {
    defaultStates = {
      type: 'primary',
      value: 'on',
      option: null,
      on: false,
    }

    constructor(component, states) {
      super()
      this.initNode(component)
      this.inputNode = this.node.getElementsByTagName('INPUT')[0]
      this.switchNode = this.node.querySelector('.switch')
      this.labelNode = this.node.getElementsByTagName('LABEL')[0]
      this.initStates(states)
      this.states.value = this.inputNode.value
      this.switchNode.addEventListener('click', () => {
        this.setState('on', !this.states.on)
        let value = ''
        if (this.states.activeValue) {
          value = this.states.on ? this.states.activeValue : this.states.inactiveValue
        } else {
          value = this.states.on ? this.states.value : ''
        }
        if (this.states.activeLabel) {
          this.labelNode.innerText = this.states.on ? this.states.activeLabel : this.states.inactiveLabel
        }
        this.emit('onChange', value)
        this.inputNode.value = value
        this.inputNode.checked = this.states.on ? 'checked' : false
      })
    }

    type = () => {
    }

    value = () => {
    }

    on = (isOn) => {
      this.switchNode.classList.toggle('on', isOn)
      this.switchNode.classList.toggle(this.states.type, isOn)
    }

    label = (label) => {
      this.labelNode.innerText = label
    }

    activeLabel = (activeLabel) => {
      if (this.states.on) {
        this.labelNode.innerText = activeLabel
      }
    }

    inactiveLabel = (inactiveLabel) => {
      if (!this.states.on) {
        this.labelNode.innerText = inactiveLabel
      }
    }

    disabled = (isDisabled) => {
      this.node.classList.toggle('disabled', isDisabled)
    }

    option = (option) => {
      if (option) {
        this.node.innerHTML = ''
        const input = document.createElement('INPUT')
        input.type = 'checkbox'
        if (option.value) {
          input.value = option.value
          if (this.mounted) {
            this.states.value = option.value
          }
        }
        if (option.checked) {
          input.checked = 'checked'
        }
        this.node.appendChild(input)

        const span = document.createElement('SPAN')
        const span2 = document.createElement('SPAN')
        span.className = 'switch'
        span2.className = 'circle'
        span.appendChild(span2)
        this.node.appendChild(span)
        if (option.label) {
          const label = document.createElement('LABEL')
          label.innerText = option.label
          if (option.after) {
            this.node.appendChild(label)
          } else {
            this.node.insertBefore(label, span)
          }
          this.labelNode = label
        }
        if (this.mounted) {
          span.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('on')
          })
        }
        this.inputNode = input
        this.switchNode = span
      }
    }
}
