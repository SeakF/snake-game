const gameState = {
    started: false,
    lost: false,
    points: 0,
}

const endScreen = () => {
    document.querySelector('.end-screen').style.display = 'flex'
    document.querySelector('.score').innerHTML = `Your score: ${gameState.points || 0}`
}

const point = {
    x: null,
    y: null,
    point: null,
    rand: function() {
        this.x = Math.floor(Math.random()*70)*10
        this.y = Math.floor(Math.random()*70)*10
    },
    generatePoint: function() {
        if (this.x && this.y) {
            this.rand()
            let check = false
            snake.segments.forEach(segment => {
                if (this.x == segment.x && this.y == segment.y) check = true
            })
            if (check) {
                return this.generatePoint()
            } else {
                if (!this.point) {
                    let board = document.querySelector('article')
                    let point = board.appendChild(document.createElement('div'))
                    point.classList.add('point-element')
                    this.point = point
                }
                this.point.style.left = this.x + "px"
                this.point.style.top = this.y + "px"
            }
        } else {
            this.rand()
            return this.generatePoint()
        }
    },
    getPoint: function() {
        gameState.points += 10
        document.querySelector('.points').innerHTML = gameState.points
        snake.newSegment()
    }
}

class snakeSegment {
    constructor (index) {
        this.x
        this.y
        this.lastX = null
        this.lastY = null
        this.index = index
        this.element = null
        this.show = () => {
            let board = document.querySelector('article')
            let segment = board.appendChild(document.createElement('div'))

            segment.classList.add('snake-element')
            segment.classList.add(`index-${this.index}`)
            this.element = segment
            this.element.style.display = 'none'
        }
        this.move = (px, py) => {
            if (!gameState.lost) {
                this.lastX = this.x
                this.lastY = this.y
                this.x = px
                this.y = py
                this.element.style.left = px + 'px'
                this.element.style.top = py + 'px'
                if (this.element.style.display == 'none') this.element.style.display = 'block'
                snake.segments[this.index+1] && snake.segments[this.index+1].move(this.lastX, this.lastY)
            }
        }
    }
}

const snake = {
    x: 200,
    y: 200,
    lastX: null,
    lastY: null,
    direction: null,
    lastMove: null,
    interval: null,
    segments: [],
    newSegment: function() {
        this.segments.push(new snakeSegment(this.segments.length))
        this.segments.at(-1).show()
    },
    moveTimeout: function() {
        this.interval = setInterval(() => {
            this.lastX = this.x
            this.lastY = this.y
            this.move(this.direction)
            this.lastMove = this.direction
            this.pushElement()
            this.segments[0] && this.segments[0].move(this.lastX, this.lastY)
        }, 60)
    },
    pushElement: function() {
        let head = document.getElementById('snake-head')
        this.segments.forEach(segment => {
            if (segment.x == this.x && segment.y == this.y) return this.lost()
        })
        if (!gameState.lost) {
            head.style.left = this.x + 'px'
            head.style.top = this.y + 'px'
            if (this.x == point.x && this.y == point.y) {
                point.getPoint()
                point.generatePoint()
                document.querySelectorAll('.snake-element').forEach((element, idx) => 
                    setTimeout(() => {
                        element.style.backgroundColor = 'rgb(57, 143, 57)'
                        setTimeout(() => {
                            element.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
                        }, 210)
                    }, 30 * idx)
                )
            }
        }
    },
    move: function() {
        switch (this.direction) {
            case 'w':
                if (this.y > 0) { 
                    this.y -= 10
                } else this.lost()
                break;
            case 'a':
                if (this.x > 0) {
                    this.x -= 10
                } else this.lost()
                break;
            case 's':
                if (this.y < 690) {
                    this.y += 10
                } else this.lost()
                break;
            case 'd':
                if (this.x < 690) {
                    this.x += 10
                } else this.lost()
                break;
        }
    },
    lost: function() {
        gameState.lost = true
        document.querySelectorAll('.snake-element').forEach(element => element.style.backgroundColor = 'red')
        clearInterval(this.interval)
        endScreen()
        return
    }
}

const moveSnake = (key) => {
    if (snake.lastMove) {
        if ((snake.lastMove == 'w' || snake.lastMove == 's') && (key == 'a' || key == 'd')) snake.direction = key
            else if ((snake.lastMove == 'a' || snake.lastMove == 'd') && (key == 'w' || key == 's')) snake.direction = key
    } else snake.direction = key
    if (!snake.interval) snake.moveTimeout() 

    if (!gameState.started) {
        gameState.started = !gameState.started
        point.generatePoint()
        document.querySelector('.info').style.display = 'none'
    }
}

window.addEventListener('keypress', (e) => {
    if (e.key == 'w' ||e.key == 'a' ||e.key == 's' ||e.key == 'd') moveSnake(e.key)
})

document.getElementById('reset').addEventListener('click', () => {
    window.location.reload()
})

document.getElementById('accept-button').addEventListener('click', async (e) => {
    e.preventDefault()
    document.getElementById('accept-button').disabled = 'true'
    document.getElementById('accept-button').innerText = 'SAVED'
    let nickname = document.getElementById('nickname').value

    try {
        let result = await fetch('//snake.fgozdz.pl/routes/points', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({nickname, points: gameState.points})
        })
    } catch (err) {
        console.error(err)
    }
})

window.addEventListener('load', async () => {
    let leaderboard = document.getElementById('score-table')
    try {
        let result = await fetch('//snake.fgozdz.pl/routes/points', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        let response = await result.json()
        response.results.map((result) => {
            leaderboard.innerHTML += `<div class='leaderboard-row'><div>nickname: ${result.nickname}</div><div>score: ${result.points}</div></div>`
        })
    } catch (err) {
        console.error(err)
    }
})