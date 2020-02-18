let COMHelper = require('../util/COMHelper')

window.selectedPort = '';

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
                    <select id="COMPorts" v-model="selectedPort">
                        <option v-for="port in ports" :value="port.path">{{port.path}}</option>
                    </select></tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `,//makes the template for page
    data: function() {
        return {
            ports: [],
            selectedPort: ''
        }
    }, 
    watch: {
        selectedPort: function(newPort) {
            window.selectedPort = newPort;
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
        },
        showModal() {
            $('#preferences-modal').modal('show')
        }
    }

})