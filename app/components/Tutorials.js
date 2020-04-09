

Vue.component('tutorials', {
    template: `
    <div id="tutorials-modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Tutorials</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                            <a class="nav-link active" data-toggle="tab" href="#gettingstarted">Setting Up</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link" data-toggle="tab" href="#gameo">Game Objects</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link" data-toggle="tab" href="#control">Control</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link" data-toggle="tab" href="#variables">Variables</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link" data-toggle="tab" href="#compilation">Uploading</a>
                            </li>
                        </ul>
                        
                        <!-- Tab panes -->
                        <div class="tab-content">
                            <div class="tab-pane container active" id="gettingstarted">
                                <br>
                                <p>
                                Welcome to Arduboy Game Studio,
                                You currently can see a workspace, to toggle Sprites (Images), click on Sprites in the top right corner.
                                A big thing when using Arduboy Game Studio is that each of the tabs seen here:<br>
                                <img src="./tutorials/tutorial_tabs.png"><br>
                                act as different objects among the screen, you're able to reference them from one another easily as well as set each one to have
                                their own individual (Image) maybe even using the same image for different objects!
                                You're able to add a new object by pressing the '+' button. <br/>After this, just start dragging blocks from the sections on the left hand side of the screen.

                                Everything that's in the code base will be continually repeated, unless you place it into the "When Game Starts" block which will only be run at the start.
                                <br/>To look at Examples, go to "File > Examples" to load up an example project!
                                </p>
                            </div>
                            <div class="tab-pane container fade" id="gameo">
                                <p>
                                The game object is where we set what sprite we want an object to use as well as the position of the sprite,
                                when first loading the program, you should set this within the "When Game Starts" block, to not use up as much processing power as everything else will be repeated constantly.
                                <br/> <img src="./tutorials/tutorial_gameobject.png"> <br/>
                                The Above sets our object to the smiley sprite and the starting position to X=10 and Y=5.
                                </p>
                            </div>
                            <div class="tab-pane container fade" id="control">
                                <p>
                                The Control section is an important one you can write conditional statements, and print text to the screen.
                                </p>
                                <h5>If/Else Statements</h5>
                                <p>
                                This is a conditional statement where what ever is in the first box and if it's true or correct, it will run the below, however with if/else you can press the settings button and turn it into and if else
                                 which if it 's not true run this other abstract code. For Example:<br>
                                <img src="./tutorials/tutorial_ifelse.png"> <br/>
                                This will set it to 0 constantly, before it's able to run so will always leave the lines of code with test being 1.
                                </p> <h5>Repeat Statements</h5>
                                <p>Repeat statements will run however many times you set it to be, however you can make it interchangable if you want it to keep repeating, for example: <br/>
                                <img src="./tutorials/tutorial_while.png"> <br/>
                                </p>
                            </div>
                            <div class="tab-pane container fade" id="variables">
                                <p>
                                A variable is somewhere we can store numbers or information about our program, to create one go to the Variables selection and press new Variable and give it any name
                                <br/>You should now see it pop like below: <br/>
                                <img src="./tutorials/tutorial_var.png"> <br/>
                                You can now drag some of these into the program and edit them however you wish. Make sure to set them first before trying to call it otherwise, you might run into some issues later on!
                                </p>
                            </div>
                            <div class="tab-pane container fade" id="compilation">
                                <p>
                                To upload your project to the device, you must first of all make sure that, you press the verify button and then wait for a positive confirmation. This checks to make sure your code is okay!<br/>
                                You must then make sure that you've selected a COM Port in your preferences as this is the USB port the program will attempt to upload to making sure your Arduboy is plugged in.<br/>
                                <img src="./tutorials/tutorial_preferences.png"> <br/>
                                Then once this is done, you can press the Upload button and once you've got another positive confirmation, you should see your program running on the screen.
                                <img src="./tutorials/tutorial_confirmation.png"> <br/>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function() {

    },
    methods: {
        showModal() {
            $('#tutorials-modal').modal('show')
        }
    }
})
