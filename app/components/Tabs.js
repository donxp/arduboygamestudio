let AsyncFileHelper = require('../util/AsyncFileHelper.js')

Vue.component('tabs', {
  template: `
  <div style="display:block;">
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="(tab, index) in tabs">
        <a class="nav-link" :class="{'active': selected == index}">{{ tab }}</a>
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
      tabs: ['main'],
      selected: 0
    }
  },
  mounted: function() {
    console.log('tabs mounted')
    // window.workspace.clear()
    this.resetProject()
  },
  methods: {
    resetProject: function() {
      window.workspace.clear()
      var defaultFile = '<files></files>'
      // writeTest().then(() => {
      //   console.log('done writing')
      // })
      // FS.writeFile("recent.ard", defaultFile, (err) => {
      //     if (err) {
      //         console.log("There was an error");
      //     }
      //     else {
      //         console.log("recent.ard is good to go!");
      //     }
      // });
      // this.tabs = ['main']
      // this.selected = 0
    },
    newTab: function() {
      this.tabs.push('new tab')
    }
  }
})