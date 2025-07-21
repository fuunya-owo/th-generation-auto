from flask import Blueprint, render_template, request, redirect, url_for
import json
import os, re

main = Blueprint('main', __name__)
DATA_FOLDER = 'app/data'
GENERATED_FOLDER = 'app/generated_pages'
SKELETON_FOLDER = 'app/html_skeletons'

def extract_languages(schema):
    languages = []
    seen = set()
    for field in schema.values():
        for key in field.keys():
            if "content" in key and "Spoiler" not in key and key != "content":
                lang_code = key.replace("content", "")
                if lang_code and lang_code not in seen:
                    seen.add(lang_code)
                    languages.append(lang_code)
    return languages

def get_tree(root, base=''):
    tree = []
    for entry in sorted(os.listdir(root)):
        path = os.path.join(root, entry)
        rel_path = os.path.join(base, entry)
        if os.path.isdir(path):
            tree.append({
                'type': 'dir',
                'name': entry,
                'children': get_tree(path, rel_path)
            })
        else:
            tree.append({
                'type': 'file',
                'name': entry,
                'path': rel_path.replace("\\", "/")  # sécurité Windows
            })
    return tree


@main.route('/')
def index():
    tree = get_tree(DATA_FOLDER)
    return render_template('index.html', tree=tree)


@main.route('/form/<path:filename>', methods=['GET', 'POST'])
def form(filename):
    json_path = os.path.join(DATA_FOLDER, filename)

    with open(json_path, encoding='utf-8') as f:
        schema = json.load(f)

    is_example = filename.endswith("example.json")

    # Si c'est un fichier d'exemple, forcer le champ nameFile à vide
    if is_example and "nameFile" in schema:
        schema["nameFile"]["content"] = ""
    
    # Récupération des templates disponibles
    available_templates = [
        f for f in os.listdir(SKELETON_FOLDER) if f.endswith(".html")
    ]
    
    languages = extract_languages(schema)


    if request.method == 'POST':
        for key, field in schema.items():
            field_type = field.get("type")

            if field_type in ["icon", "image", "input", "textarea", "template"]:
                for subkey in list(field.keys()):
                    if subkey not in ["label", "type"]:
                        form_key = f"{key}_{subkey}"
                        field[subkey] = request.form.get(form_key, "")

            elif field_type == "multipleArea":
                new_field = {}
                for subkey in list(field.keys()):
                    if subkey in ["label", "type"]:
                        new_field[subkey] = field[subkey]
                        continue

                    values = []
                    i = 0
                    while True:
                        form_key = f"{key}_{subkey}_{i}"
                        if form_key in request.form:
                            content = request.form[form_key].strip()
                            values.append(content)
                            i += 1
                        else:
                            break
                    new_field[subkey] = values
                schema[key] = new_field

            elif field_type == "color":
                for content in ['content', 'contentSpoiler']:
                    new_content = {}
                    group_indices = set()

                    # Repère tous les group_index présents dans le form
                    for form_field in request.form:
                        if form_field.startswith(f"{key}_{content}_group_"):
                            parts = form_field.split("_")
                            try:
                                group_idx = int(parts[3])
                                group_indices.add(group_idx)
                            except (IndexError, ValueError):
                                continue

                    # Parcours chaque group_index repéré
                    for group_index in sorted(group_indices):
                        group_prefix = f"{key}_{content}_group_{group_index}"
                        found_any = False
                        group_data = {}

                        # Gère les langues
                        for form_field in request.form:
                            if form_field.startswith(group_prefix + "_content"):
                                lang_suffix = form_field.replace(group_prefix + "_content", "")
                                group_data[f"content{lang_suffix}"] = request.form[form_field]
                                found_any = True

                        # Gère les couleurs (repérer tous les color_index existants pour ce groupe)
                        colors = []
                        for form_field in request.form:
                            if form_field.startswith(f"{group_prefix}_color_"):
                                try:
                                    color_idx = int(form_field.split("_")[-1])
                                    colors.append((color_idx, request.form[form_field]))
                                    found_any = True
                                except ValueError:
                                    continue
                        # Trie les couleurs par index et extrait les valeurs
                        colors = [color for _, color in sorted(colors)]
                        group_data["colors"] = colors

                        if found_any:
                            new_content[str(group_index)] = group_data

                    # Recompacte les index pour supprimer les trous : 0, 1, 3 -> 0, 1, 2
                    reindexed_content = {}
                    for new_index, old_index in enumerate(sorted(new_content.keys(), key=int)):
                        reindexed_content[str(new_index)] = new_content[old_index]

                    if content == "content":
                        field["content"] = reindexed_content
                    else:
                        field["contentSpoiler"] = reindexed_content

            elif field_type == "links":
                new_content = []
                link_template = field.get("link", [])

                index_pattern = re.compile(rf"^{re.escape(key)}_(\w+?)_(\d+)(?:_.*)?$")

                indices = set()
                for form_key in request.form.keys():
                    match = index_pattern.match(form_key)
                    if match:
                        indices.add(int(match.group(2)))
                print(indices)

                for i in sorted(indices):
                    entry = {}
                    found_any = False

                    for link_field in link_template:
                        link_key = link_field["key"]
                        link_type = link_field["type"]
                        label = link_field["label"]

                        full_key_prefix = f"{key}_{link_key}_{i}"

                        value = {
                            "label": label,
                            "type": link_type
                        }

                        if link_type == "image":
                            content = request.form.get(f"{full_key_prefix}_content", "")
                            spoiler = request.form.get(f"{full_key_prefix}_contentSpoiler", "")
                            value["content"] = content
                            value["contentSpoiler"] = spoiler
                            if content or spoiler:
                                found_any = True

                        elif link_type in ["input", "textarea"]:
                            for lang in languages:
                                content = request.form.get(f"{full_key_prefix}_content{lang}", "")
                                spoiler = request.form.get(f"{full_key_prefix}_content{lang}Spoiler", "")
                                value[f"content{lang}"] = content
                                value[f"content{lang}Spoiler"] = spoiler
                                if content or spoiler:
                                    found_any = True

                        elif link_type == "color":
                            colors = []
                            color_index = 0
                            while True:
                                color_val = request.form.get(f"{full_key_prefix}_color_{color_index}")
                                if color_val:
                                    colors.append(color_val)
                                    color_index += 1
                                    found_any = True
                                else:
                                    break
                            value["colors"] = colors

                        elif link_type == "multiple_textarea":
                            for lang in languages:
                                values = []
                                index_mt = 0
                                while True:
                                    mt_key = f"{full_key_prefix}_content{lang}_{index_mt}"
                                    val = request.form.get(mt_key, "")
                                    if val:
                                        values.append(val)
                                        found_any = True
                                        index_mt += 1
                                    else:
                                        break
                                value[f"content{lang}"] = values

                        elif link_type == "icon":
                            icon_value = request.form.get(f"{full_key_prefix}_content", "")
                            value["content"] = icon_value
                            if icon_value:
                                found_any = True

                        entry[link_key] = value

                    if found_any:
                        new_content.append(entry)

                field["content"] = new_content

        # Récupérer le nouveau nom du fichier depuis le champ "nameFile"
        new_name = schema.get("nameFile", {}).get("content", "").strip()

        if not new_name:
            return render_template('form.html', schema=schema, filename=filename, templates=available_templates, languages=languages, error="Le champ nameFile est obligatoire.")
        
        path_origin = os.path.dirname(filename)
        # Chemins de sortie
        new_json_filename = f"{new_name}.json"
        new_json_path = os.path.join(DATA_FOLDER, path_origin, new_json_filename)
        os.makedirs(os.path.dirname(new_json_path), exist_ok=True)

        new_html_filename = f"{new_name}.html"
        new_html_path = os.path.join(GENERATED_FOLDER, path_origin, new_html_filename)
        os.makedirs(os.path.dirname(new_html_path), exist_ok=True)

        # Écriture du nouveau JSON
        with open(new_json_path, 'w', encoding='utf-8') as out_f:
            json.dump(schema, out_f, indent=4, ensure_ascii=False)

        # Génération HTML
        generate_page(schema, new_html_path)

        return redirect(url_for('main.index'))
    return render_template('form.html', schema=schema, filename=filename, templates=available_templates, languages=languages)



def generate_page(data, file_path):
    from flask import render_template_string

    template_name = data.get("templateUsed", {}).get("content", "base_template.html")
    template_path = os.path.join(SKELETON_FOLDER, template_name)

    with open(template_path, encoding="utf-8") as f:
        template_str = f.read()

    rendered = render_template_string(template_str, data=data)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(rendered)
