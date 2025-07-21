# Variables
PYTHON=python
PIP=pip
NPM=npm
APP_DIR=app

# Commandes

## Lancer le site Flask
run:
	$(PYTHON) run.py

## Installer les dépendances Python
install-py:
	$(PIP) install -r requirements.txt

## Installer les dépendances JS (ex: TailwindCSS)
install-js:
	cd $(APP_DIR) && $(NPM) install

## Compiler Tailwind CSS
build-css:
	cd $(APP_DIR) && $(NPM) run build-css

## Nettoyer les fichiers CSS compilés
clean-css:
	rm -f $(APP_DIR)/static/css/main.css

## Tout installer
install: install-py install-js

## Rebuild complet du CSS
rebuild-css: clean-css build-css

## Lancer tout pour dev
dev: install build-css run
