let COMHelper = require('../util/COMHelper')

Vue.component('preferences', {
    template: `
    <div id="preferences-modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Preferences</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    Close
                    </button>
                </div>
                <div class="modal-body">

                    <h5>COM Port Selection</h5>
                    <select id="COMPorts" v-for="port in ports">
                        <option id="{port.name}" value="{port.name}">{port.name}</option>
                    </select>
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
    computed: {
        ports: function() {//loads ports into list when loaded
            return COMHelper.checkForPorts()
        }
    },
    methods: {
        refreshPorts: function() {
            this.ports = COMHelper.checkForPorts();
        },
        setPort: function(port) {
            //check to see if port is of type arduboy that we are using
            this.selectedPort = port;
        },
        getPort: function() {
            return selectedPort;
        }
    }

})