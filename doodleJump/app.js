// tutorial -> https://www.youtube.com/watch?v=YSEsSs3hB6A
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const character = document.createElement('div')
  let characterLeftSpace = 50
  let startPoint = 150
  let characterBottomSpace = startPoint
  let isGameOver = false
  let platformCount = 5
  let platforms = []
  let upTimerId //interval
  let downTimerId //interval
  let isJumping = false
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId //interval
  let rightTimerId //interval
  let score = 0

  class Platform {
    constructor(newPlatformBottom) {
      // platform position
      this.bottom = newPlatformBottom
      this.left = Math.random() * 315

      // platform div
      this.visual = document.createElement('div')

      const visual = this.visual
      visual.classList.add('platform')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'

      grid.appendChild(visual)
    }
  }

  const createcharacter = () => {
    // character'ı oluştur
    grid.appendChild(character)
    character.classList.add('character')
    characterLeftSpace = platforms[0].left

    // character'ı sola taşı
    character.style.left = characterLeftSpace + 'px'

    character.style.bottom = characterBottomSpace + 'px'
  }

  const createPlatforms = () => {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount
      let newPlatformBottom = 100 + i * platformGap
      let newPlatform = new Platform(newPlatformBottom)
      platforms.push(newPlatform)
      console.log(platforms)
    }
  }
  //platformları aşağıya doğru hareket ettiren ve en altta silen kod
  const movePlatforms = () => {
    if (characterBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4
        let visual = platform.visual
        visual.style.bottom = platform.bottom + 'px'

        if (platform.bottom < 0) {
          let firstPlatform = platforms[0].visual
          firstPlatform.classList.remove('platform')
          platforms.shift()
          score++
          let newPlatform = new Platform(window.innerHeight)
          platforms.push(newPlatform)
        }
      })
    }
  }

  const jump = () => {
    // fall interval'i durdur
    clearInterval(downTimerId)

    isJumping = true
    upTimerId = setInterval(() => {
      characterBottomSpace += 10
      character.style.bottom = characterBottomSpace + 'px'
      if (characterBottomSpace > startPoint + 175) {
        fall()
      }
    }, 30)
  }

  const fall = () => {
    // jump interval'i durdur
    clearInterval(upTimerId)

    isJumping = false
    downTimerId = setInterval(() => {
      characterBottomSpace -= 5
      character.style.bottom = characterBottomSpace + 'px'
      if (characterBottomSpace <= 0) {
        gameOver()
      }
      platforms.forEach((platform) => {
        if (
          characterBottomSpace >= platform.bottom &&
          characterBottomSpace <= platform.bottom + 15 &&
          characterLeftSpace + 60 >= platform.left &&
          characterLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          console.log('landed')
          startPoint = characterBottomSpace
          jump()
        }
      })
    }, 30)
  }

  const gameOver = () => {
    console.log('game over')
    isGameOver = true

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }

    grid.innerHTML = score

    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  const control = (e) => {
    if (e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      moveStraight()
    }
  }

  const moveLeft = () => {
    if (isGoingRight) {
      clearInterval(rightTimerId)
      isGoingRight = false
    }

    isGoingLeft = true

    leftTimerId = setInterval(() => {
      if (characterLeftSpace >= 0) {
        characterLeftSpace -= 5
        character.style.left = characterLeftSpace + 'px'
      } else {
        moveRight()
      }
    }, 20)
  }

  const moveRight = () => {
    if (isGoingLeft) {
      clearInterval(leftTimerId)
      isGoingLeft = false
    }

    isGoingRight = true

    rightTimerId = setInterval(() => {
      if (characterLeftSpace <= 340) {
        characterLeftSpace += 5
        character.style.left = characterLeftSpace + 'px'
      } else {
        moveLeft()
      }
    }, 20)
  }

  const moveStraight = () => {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  const start = () => {
    if (!isGameOver) {
      createPlatforms()
      createcharacter()

      setInterval(movePlatforms, 30)
      jump()
      document.addEventListener('keyup', control)
    }
  }

  // attach to button
  start()
})
