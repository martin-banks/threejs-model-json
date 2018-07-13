const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)
const pre = document.createElement('pre')
document.body.appendChild(pre)

const dumpContent = {
  sections: [],
}
const lorem = 'Esse est ad velit labore aliqua ut proident ipsum nostrud aliquip. Sunt eiusmod sit tempor nostrud. Aliqua sunt et cillum et ad esse et nisi id nulla ullamco Lorem sunt sunt. Culpa culpa eu dolore irure veniam consequat quis excepteur quis. Ut irure minim duis anim eu nulla esse.'
const makeSections = [...new Array(5)]
  .map((s, i) => {
    return `<section id="wrapper-${i}">
      <div class="wrapper">
        <h1>Section ${i}</h1>
        <p>${lorem}</p>
      </div>
    </section>`
  })
  .join('')

const page = [
  [...new Array(5)].map(p => `<p>${lorem}</p>`).join(''),
  makeSections,
  [...new Array(5)].map(p => `<p>${lorem}</p>`).join(''),
].join('')

app.innerHTML = page

const sections = document.querySelectorAll('section')
function dump () {
  pre.innerText = JSON.stringify(dumpContent, 'utf-8', 2)
}

const updateDump = {
  section (s, i) {
    const { height, top } = s.getBoundingClientRect()
    dumpContent.sections[i] = {
      name: s.getAttribute('id'),
      posY: s.offsetTop,
      height,
      top,
    }
  },
  scroll () {
    dumpContent.scrollY = window.scrollY
  }
}

const mods = [
  {
    func (el, pct) {
      e.style.opacity = 1 - pct
    }
  }
]

function handleScroll (e) {
  updateDump.scroll()
  sections.forEach(updateDump.section)

  sections.forEach(s => {
    const { top, height } = s.getBoundingClientRect()
    if (top < 0 && top > (0 - window.innerHeight)) {
      s.querySelector('h1').innerText = `Active: ${window.scrollY}px`
      const pct = 0
      mods[0].func(s, pct)
    }
  })

  dump()
}

window.addEventListener('scroll', handleScroll)
