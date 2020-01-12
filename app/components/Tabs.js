let AsyncFileHelper = require('../util/AsyncFileHelper.js')

Vue.component('tabs', {
  template: `
  <div style="display:block;">
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="(tab) in tabs">
        <a class="nav-link" :class="{'active': tab == currentTab}">{{ tab }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click="newTab">+</a>
      </li>
    </ul>
  </div>
  `,
//   template: `
//   <div class="project-tabs">
//   <div class="tab" id="main">main</div> 
//   <div class="tabadd" id="tabAddition">+</div>
// </div>
//   `,
  data: function() {
    return {
      selected: 0
    }
  },
  computed: {
    tabs: function() {
      return window.currentProject.files.map(p => p.name)
    },
    currentTab: function() {
      return window.currentProject.tab
    }
  },
  mounted: function() {
    console.log('tabs mounted')
    window.workspace.clear()
  },
  methods: {
    newTab: function() {
      this.tabs.push('new tab')
    }
  }
})