function addLink(key) {
  const container = document.querySelector(`[data-links-group="${key}"]`)
  if (!container) return

  // Récupérer le template spécifique à ce groupe
  const template = container.querySelector('.link-template')
  if (!template) return
  const titleIndex = container.querySelectorAll('.link-group:not(.link-template)').length + 1
  // Trouver le plus grand index actuel
  const existingLinks = container.querySelectorAll('.link-group:not(.link-template)')
  let maxIndex = -1
  existingLinks.forEach(link => {
    const index = parseInt(link.getAttribute('data-link-index'))
    if (!isNaN(index)) maxIndex = Math.max(maxIndex, index)
  })
  const newIndex = maxIndex + 1

  // Cloner le template
  const newLink = template.cloneNode(true)
  newLink.style.display = ''
  newLink.classList.remove('link-template')
  newLink.setAttribute('data-link-index', newIndex)

  // Remplacer ___INDEX__ par le nouvel index
  newLink.querySelectorAll('[name], [id], label[for]').forEach(el => {
    if (el.name) el.name = el.name.replace(/___INDEX__/g, `_${newIndex}`)
    if (el.id) el.id = el.id.replace(/___INDEX__/g, `_${newIndex}`)
    if (el.htmlFor) el.htmlFor = el.htmlFor.replace(/___INDEX__/g, `_${newIndex}`)
  })

  // Mettre à jour le titre
  const title = newLink.querySelector('h4')
  if (title) title.textContent = `Link ${titleIndex}`

  container.appendChild(newLink)
}

function removeLink(button) {
  const linkGroup = button.closest('.link-group')
  if (!linkGroup) return

  const container = linkGroup.parentElement
  linkGroup.remove()

  // Réactualiser uniquement les titres (pas les keys)
  const links = container.querySelectorAll('.link-group:not(.link-template)')
  links.forEach((link, index) => {
    const title = link.querySelector('h4')
    if (title) title.textContent = `Link ${index + 1}`
  })
}
