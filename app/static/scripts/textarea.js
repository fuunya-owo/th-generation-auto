function addTextarea(key, subkey, spoiler = false) {
    const group = document.getElementById(`${key}_${subkey}_group`)
    const blocks = group.querySelectorAll('textarea')
    const newIndex = blocks.length

    const wrapper = document.createElement('div')
    wrapper.className = 'textarea-block'

    const textarea = document.createElement('textarea')
    textarea.name = `${key}_${subkey}_${newIndex}`
    textarea.rows = 1
    if (spoiler) textarea.className = 'spoiler'

    const removeBtn = document.createElement('button')
    removeBtn.type = 'button'
    removeBtn.innerHTML = '<i class="fas fa-times"></i> Supprimer'
    removeBtn.onclick = () => wrapper.remove()

    const removeDiv = document.createElement('div')
    removeDiv.style = 'text-align: end;'
    removeDiv.appendChild(removeBtn)

    wrapper.appendChild(textarea)
    wrapper.appendChild(removeDiv)
    const subGroup = group.querySelector('.grid-content')
    subGroup.appendChild(wrapper)
}

function removeTextarea(btn) {
    const wrapper = btn.parentNode.parentNode
    wrapper.remove()
}