Vue.component('sprite-creator', {
	template: `
	<div class="col-sm-4">
		<div id="sprite-container">
			<div class="card">
			<div class="card-body p-2">
				<button class="btn btn-sm btn-success" @click="addSprite">Add new</button>
				<hr class="mt-3 mb-4">
				<div class="sprite" v-for="(item, index) in sprites">
					<div class="row">
					<div class="col">{{ item.name }}</div>
					<div class="col-3 pr-1"><button class="btn btn-sm btn-warning btn-block">Rename</button></div>
					<div class="col-3 pl-1"><button class="btn btn-sm btn-danger btn-block">Remove</button></div>
					</div>
				</div>
				</div>
			</div>
		</div>
		<div id="sprite-creator-modal" class="modal" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
				<h5 class="modal-title">Sprite creator</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				</div>
				<div class="modal-body">
				<div class="row">
					<div class="col-sm-3 offset-sm-3">
						Sprite width: {{ creatorWidth }}
						<input v-model="creatorWidth" min="8" max="64" type="range">
					</div>
					<div class="col-sm-3">
						Sprite height: {{ creatorHeight }}
						<input v-model="creatorHeight" min="8" step="8" max="64" type="range">
					</div>
				</div>
				<canvas ref="spriteCreator" width="766" height="766" @click="spriteCreatorCanvasClick($event)"></canvas>
				</div>
				<div class="modal-footer">
				<button type="button" class="btn btn-primary" @click="spriteCreatorSave">Save</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
				</div>
			</div>
			</div>
		</div>
	</div>
	`,
	props: ['shown'],
	data: function() {
		return {
			sprites: [],
			creatorWidth: 8,
			creatorHeight: 8,
			image: []
		}
	},
	watch: {
		creatorWidth: function() {
			this.render()
			this.recreateArray()
		},
		creatorHeight: function() {
			this.render()
			this.recreateArray()
		}
	},
	methods: {
		addSprite() {
			this.resetImage()
			this.recreateArray()
			$('#sprite-creator-modal').modal('show')
			this.render()
		},
		recreateArray() {
			// create colums
			for(let i = 0; i < this.creatorWidth; i++) {
				this.image[i] = []
				for(let k = 0; k < this.creatorHeight; k++) {
					this.image[i][k] = false
				}
			}
			console.log(this.image)
		},
		resetImage() {
			this.image = []
		},
		render() {
            const ctx = this.$refs.spriteCreator.getContext('2d')
            
            const width = this.$refs.spriteCreator.width
            const height = this.$refs.spriteCreator.height

            ctx.clearRect(0, 0, width, height);
            // draw width lines
            const lineWidth = width / this.creatorWidth

            for(let i = 1; i <= this.creatorWidth; i++) {
                // this.spriteCreatorImage.length = this.spriteCreatorWidth
                // if(this.spriteCreatorImage[i-1] === undefined) {
                //     this.spriteCreatorImage[i-1] = []
                // }
                if(i === this.creatorWidth) {
                    break
                }
                let curX = lineWidth * i
                ctx.beginPath()
                ctx.moveTo(curX, 0)
                ctx.lineTo(curX, height)
                ctx.stroke()
            }

            // draw height lines
            const lineHeight = height / this.creatorHeight
            for(let i = 1; i <= this.creatorHeight; i++) {
                if(i === this.creatorHeight) {
                    break
                }
                let curY = lineHeight * i
                ctx.beginPath()
                ctx.moveTo(0, curY)
                ctx.lineTo(width, curY)
                ctx.stroke()
            }
        },
        spriteCreatorCanvasClick(event) {
            const canvas = this.$refs.spriteCreator
            const canvasRect = canvas.getBoundingClientRect()
            const width = canvas.width
            const height = canvas.height
            const x = event.clientX - canvasRect.left
            const y = event.clientY - canvasRect.top

            const col = Math.ceil(x / (width / this.creatorWidth))
            const row = Math.ceil(y / (height / this.creatorHeight))
            this.handleSpriteCreatorGridClick(row, col)
        },
        handleSpriteCreatorGridClick(row, col) {
            console.log('row: ' + row + ' col: ' + col)
        },
		spriteCreatorSave: function() {}
	}
})