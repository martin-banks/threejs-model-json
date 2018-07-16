import imagesLoaded from 'imagesloaded'

// Once the image has finished loading it will fade it
// Offers more graceful image loading
// should be used in conjunction with placeholder or background
export default {
  bind (el) {
    el.style.opacity = 0
    el.style.transition = 'opacity 1s'
    imagesLoaded(el, { background: true }, () => {
      el.style.opacity = 1
    })
  }
}
