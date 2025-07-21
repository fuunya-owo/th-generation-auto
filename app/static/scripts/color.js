function addColorGroup(key, languages, sectionType = 'content') {
  const container = document.getElementById(`${key}_${sectionType}_groups`);

  // Trouver le plus grand index existant et incrémenter
  const indices = Array.from(container.querySelectorAll('[data-group-index]'))
                       .map(div => parseInt(div.getAttribute('data-group-index')))
                       .filter(n => !isNaN(n));
  const newIndex = indices.length ? Math.max(...indices) + 1 : 0;

  const div = document.createElement('div');
  div.setAttribute('data-group-index', newIndex);

  // Contenu du groupe
  let html = `
    <div class="grid-content-2">
      <strong>Groupe ${newIndex + 1}</strong>
      <button type="button" onclick="removeColorGroup(this)">
        <i class="fas fa-times"></i> Supprimer ce groupe
      </button>
    </div>

    <div class="grid-content-2">
  `;

  languages.forEach(lang => {
    html += `
      <label>Label (${lang})</label>
      <input type="text" 
             name="${key}_${sectionType}_group_${newIndex}_content${lang}">
    `;
  });

  html += `
    </div>
    <div data-color-list class="colors">
      <input type="color" name="${key}_${sectionType}_group_${newIndex}_color_0" value="#000000">
      <button type="button" onclick="removeColor(this)">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <button type="button" onclick="addColor(this)">
      <i class="fas fa-plus"></i> Ajouter une couleur
    </button>
  `;

  div.innerHTML = html;
  container.appendChild(div);
}

function removeColorGroup(button) {
  const group = button.closest('[data-group-index]');
  if (group) group.remove();
}

function addColor(button) {
  const colorList = button.previousElementSibling;
  const existingColors = colorList.querySelectorAll('input[type="color"]');
  if (!existingColors.length) return;

  const lastInput = existingColors[existingColors.length - 1];
  const baseName = lastInput.name.replace(/_color_\d+$/, '');
  const newIndex = existingColors.length;

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.name = `${baseName}_color_${newIndex}`;
  colorInput.value = '#000000';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.innerHTML = '<i class="fas fa-times"></i>';
  removeBtn.onclick = () => removeColor(removeBtn);

  colorList.appendChild(colorInput);
  colorList.appendChild(removeBtn);
}

function removeColor(button) {
  const input = button.previousElementSibling;
  if (input && input.type === 'color') input.remove();
  button.remove();
}
