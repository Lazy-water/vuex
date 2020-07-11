export default function (Vue) {
  // 获取Vue大版本
  const version = Number(Vue.version.split('.')[0])
  // Vue版本为2.x
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // 重写init并vuex init的过程，实现1.x向后兼容
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook，注入到每个实例init hooks列表中。
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // 如果为根组件执行options.store
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 子组件直接父组件获取$store,保证所有组件公用一份store
      this.$store = options.parent.$store
    }
  }
}
