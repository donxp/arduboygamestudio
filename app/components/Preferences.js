let COMHelper = require('../util/COMHelper')

Vue.component('preferences', {
    template: `
    <div id="preferences-modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Preferences</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table><tr>
                    <h5>COM Port Selection</h5>
                    <select id="COMPorts">
                        <option v-for="port in ports" id="{{port.path}}" value="{{port.path}}">{{port.path}}</option>
                    </select></tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `,//makes the template for page
    props: ['shown'],
    data: function() {
        return {
            ports: [],
            selectedPort: ''
        }
    }, 
    watch: {
        shown: function(newShown) {
            if(newShown) { 
                $('#preferences-modal').modal('show')
            } else {
                $('#preferences-modal').modal('hide')
            }
        }
    },
    mounted: function() {
        this.refreshPorts()
    },
    methods: {
        refreshPorts: function() {
            COMHelper.checkForPorts().then(res => {
                this.ports = res
                console.log(this.ports);
            })
            
        },
        setPort: function(port) {
            this.selectedPort = port;
        },
        getPort: function() {
            return selectedPort;
        }
    }

})