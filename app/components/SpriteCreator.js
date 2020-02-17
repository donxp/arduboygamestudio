const Dialog = require('dialogs')()

Vue.component('sprite-creator', {
	template: /*html*/`
	<div class="col-sm-4">
		<div id="sprite-container">
			<div class="card">
			<div class="card-body p-2">
				<button class="btn btn-sm btn-success" @click="addSprite">Add new</button>
				<hr class="mt-3 mb-4">
				<div class="sprite" v-for="(item, index) in sprites">
					<div class="row">
                    <div class="col">{{ item.name }}</div>
					<div class="col-3 pr-1"><button class="btn btn-sm btn-warning btn-block" @click="edit(index)">Edit</button></div>
					<div class="col-3 pl-1"><button class="btn btn-sm btn-danger btn-block" @click="remove(index)">Remove</button></div>
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
                <div class="d-flex">
                    <div style="width: 25%">
                        <input v-model="newSpriteName" type="text" class="form-control form-control-sm" placeholder="Name">
                    </div>
                    <div style="width: 75%; margin-left: 10px">
                        <div class="d-flex">
                            <div style="width: 40%">
                                <div class="d-flex">
                                    <div style="width: 30%">
                                        Width:
                                    </div>
                                    <div style="width: 70%">
                                        <template v-if="!editDimensions">
                                            {{ creatorWidth }}
                                        </template>
                                        <template v-else>
                                            <input v-model="editDimensionsWidth" class="form-control form-control-sm" type="number">
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div style="width: 40%; margin-left: 5px">
                                <div class="d-flex">
                                    <div style="width: 30%">
                                        Height:
                                    </div>
                                    <div style="width: calc(70% - 10px); margin-right: 10px">
                                        <template v-if="!editDimensions">
                                            {{ creatorHeight }}
                                        </template>
                                        <template v-else>
                                            <input v-model="editDimensionsHeight" class="form-control form-control-sm" type="number">
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div style="width: 20%">
                                <button v-if="!editDimensions" class="btn btn-primary btn-block btn-sm" @click="toggleEditDimensions">Edit</button>
                                <button v-else class="btn btn-warning btn-block btn-sm" @click="toggleEditDimensions">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
				<!--<div class="row">
					<div class="col-sm-4 d-flex align-items-center">
						<input v-model="newSpriteName" type="text" class="form-control form-control-sm" placeholder="Name">
					</div>
					<div class="col-sm-8">
                        <div class="row">
                            <div class="col-sm-6">width</div>
                            <div class="col-sm-6">height</div>
                            <div class="col-sm-6">
                                <div class="row">
                                    <div class="col-sm-4">
                                        Width: {{ creatorWidth }}
                                    </div>
                                    <div class="col-sm-8">
                                        <input v-model="creatorWidth" min="8" max="64" type="range">
                                    </div>
                                </div>
							</div>
							<div class="col-sm-6">
								Height: {{ creatorHeight }}
								<input v-model="creatorHeight" min="8" step="8" max="64" type="range">
							</div>
						</div>
					</div>
				</div>-->
				<canvas class="mt-3" ref="spriteCreator" width="766" height="766" @click="spriteCreatorCanvasClick($event)"></canvas>
				</div>
				<div class="modal-footer">
				<button type="button" class="btn btn-primary" @click="save" :disabled="newSpriteName.length < 3">Save</button>
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
			image: [],
			newSpriteName: '',
			editMode: false,
			editingIdx: -1,
            spriteDimensionWatcher: true,
            editDimensions: false,
            editDimensionsWidth: 0,
            editDimensionsHeight: 0
		}
	},
	methods: {
		addSprite() {
			this.editMode = false
			this.editingIdx = -1

			this.resetImage()
			this.recreateArray()

			this.creatorWidth = 8
			this.creatorHeight = 8
			this.newSpriteName = ''

			$('#sprite-creator-modal').modal('show')
			this.render()
		},
		edit(index) {
			this.editMode = true
            this.editingIdx = index
            
            const sprite = this.sprites[index]
            const spriteWidth = sprite.image.length
            const spriteHeight = sprite.image[0].length

            console.log(`edit sprite idx ${index}, dimensions: ${spriteWidth}x${spriteHeight}`)

            this.creatorWidth = spriteWidth
            this.creatorHeight = spriteHeight


            console.log('set image to', this.sprites[index].image)
            this.image = sprite.image
			
			this.newSpriteName = this.sprites[index].name

            $('#sprite-creator-modal').modal('show')
            $('#sprite-creator-modal').on('shown.bs.modal', () => {
                this.render()
            })
			// this.render()
		},
		remove(index) {
			Dialog.confirm('Are you sure?').then(confirm => {
				if(confirm) {
					this.sprites.splice(index, 1)
				}
			})
		},
		validateSpriteName(name) {
			if(name.length < 3) return false
			else if(name.indexOf(' ') !== -1) return false
			return true
		},
		recreateArray() {
			console.log('array recreated')
			// create colums
			for(let i = 0; i < this.creatorWidth; i++) {
				this.image[i] = []
				for(let k = 0; k < this.creatorHeight; k++) {
					this.image[i][k] = false
				}
			}
			// console.log(this.image)
		},
		resetImage() {
			this.image = []
		},
		render() {
            if(!this.$refs.spriteCreator) return
            console.log('render call')
			const ctx = this.$refs.spriteCreator.getContext('2d')
				
			const width = this.$refs.spriteCreator.width
			const height = this.$refs.spriteCreator.height

			ctx.clearRect(0, 0, width, height);
			// draw width lines
			const lineWidth = width / this.creatorWidth

			for(let i = 1; i <= this.creatorWidth; i++) {
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

			// fill in selected squares
			for(let col = 0; col < this.creatorWidth; col++) {
				for(let row = 0; row < this.creatorHeight; row++) {
					if(this.image[col][row]) {
						ctx.beginPath()
						ctx.rect(lineWidth * col, lineHeight * row, lineWidth, lineHeight)
						ctx.fillStyle = 'black'
						ctx.fill()
					}
				}
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
			// console.log('row: ' + row + ' col: ' + col)
			this.image[col-1][row-1] = !this.image[col-1][row-1]
			// console.log(this.image)
			this.render()
		},
		save() {
			if(this.editMode) {
				this.sprites[this.editingIdx].name = this.newSpriteName
				this.sprites[this.editingIdx].image = this.image
				this.editMode = false
			} else {
				this.sprites.push({
					name: this.newSpriteName,
					image: this.image
				})
			}
			$('#sprite-creator-modal').modal('hide')

			this.newSpriteName = ''
			console.log(this.sprites)
        },
        toggleEditDimensions() {
            this.editDimensions = !this.editDimensions
            if(this.editDimensions) {
                this.editDimensionsWidth = this.creatorWidth
                this.editDimensionsHeight = this.creatorHeight
            } else {
                this.creatorWidth = this.editDimensionsWidth
                this.creatorHeight = this.editDimensionsHeight
                this.recreateArray()
                this.render()
            }
        }
	}
})