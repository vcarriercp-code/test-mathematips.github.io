#!/usr/bin/env python3
"""Télécharge les images du site Wix dans les dossiers du dépôt.

Utilisation : placer ce fichier à la racine du dépôt (à côté de index.html),
puis lancer :  python telecharger_images.py
Les images déjà présentes ne sont pas retéléchargées.
"""
import os
import urllib.request

IMAGES = [
    ("https://static.wixstatic.com/media/4ec4a8_b7a7df6c0a60471f969b9adcae616a0a~mv2.png", "images/commun/logo.png"),
    ("https://static.wixstatic.com/media/4ec4a8_e681b627da5448af9451e7aad03f72ad~mv2.png", "images/commun/icone-3eme.png"),
    ("https://static.wixstatic.com/media/4ec4a8_b2b66330cfff4d749a3dc02ed4fb3656~mv2.png", "images/accueil/bandeau.png"),
    ("https://static.wixstatic.com/media/4ec4a8_ad59832ac12744238883727907895812~mv2.png", "images/accueil/carte-6eme.png"),
    ("https://static.wixstatic.com/media/4ec4a8_853dc3b2393b41a38e9a1dce84ec566f~mv2.png", "images/accueil/carte-5eme.png"),
    ("https://static.wixstatic.com/media/4ec4a8_d0e612e559624762935ada992ade34e8~mv2.png", "images/accueil/carte-4eme.png"),
    ("https://static.wixstatic.com/media/4ec4a8_86b1df2d507845729c732177081833f5~mv2.png", "images/accueil/carte-prof.png"),
    ("https://static.wixstatic.com/media/4ec4a8_5f6d77358ada4fddb372561439f6dc5a~mv2.jpeg", "images/accueil/portrait.jpeg"),
    ("https://static.wixstatic.com/media/4ec4a8_a27f746a0f774148a95a61ade4196f4c~mv2.png", "images/3emes/icone-automatismes.png"),
    ("https://static.wixstatic.com/media/4ec4a8_de969cd48232488badcb3eaf04cd1f40~mv2.png", "images/3emes/icone-temps.png"),
    ("https://static.wixstatic.com/media/4ec4a8_eef4989827fd4c518d29576b4f78bf03~mv2.png", "images/3emes/icone-classeur.png"),
    ("https://static.wixstatic.com/media/4ec4a8_49825dbbe3c74208b4dca1ae5027e9bb~mv2.png", "images/3emes/organisation-1.png"),
    ("https://static.wixstatic.com/media/4ec4a8_c827980de8a249ddb03865cbbd0137b8~mv2.png", "images/3emes/organisation-2.png"),
    ("https://static.wixstatic.com/media/4ec4a8_bd621c4a62314797ba9d3926647ea970~mv2.png", "images/3emes/lecons/lecon-1A.png"),
    ("https://static.wixstatic.com/media/4ec4a8_af2f9c30a60344fc99df328b8a131918~mv2.jpg", "images/3emes/devoirs/semaine-2.jpg"),
]

racine = os.path.dirname(os.path.abspath(__file__))
ok, deja, erreurs = 0, 0, []

for url, chemin in IMAGES:
    dest = os.path.join(racine, *chemin.split("/"))
    if os.path.exists(dest):
        deja += 1
        continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
            f.write(r.read())
        ok += 1
        print("OK      ", chemin)
    except Exception as e:
        erreurs.append(chemin)
        print("ERREUR  ", chemin, "->", e)

print(f"\nTéléchargées : {ok} | déjà présentes : {deja} | erreurs : {len(erreurs)}")
