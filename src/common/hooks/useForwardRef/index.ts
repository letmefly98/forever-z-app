import type { Component } from 'vue'
import { defineComponent, getCurrentInstance, h } from 'vue'

/**
 * 高阶组件，用于将 ref 的透传，避免 $refs.xx.xxx 的情况
 * @param Comp 组件
 * @returns 新组件
 */
function useForwardRef(Comp: Component) {
  const hoc = defineComponent({
    name: 'ForwardRefHOC',
    __asyncLoader: Promise.resolve(), /* 骗过上帝 */
    setup() {
      const instance = getCurrentInstance()
      return () => {
        if (!instance) return null
        const { ref, props, children } = instance.vnode
        const vnode = h(Comp, props, children || [])
        vnode.ref = ref
        return vnode
      }
    },
  })
  return hoc
}
export default useForwardRef
