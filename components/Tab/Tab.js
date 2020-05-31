// components/Tab/Tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      value: [],
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handelItemTap (e) {
      //获取点击的索引
      const { index } = e.currentTarget.dataset;
      //2 触发父组件中的⌚️ 自定义
      this.triggerEvent("tabsItemChange", { index });

    }
  }
})
