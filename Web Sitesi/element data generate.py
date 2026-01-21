from bs4 import BeautifulSoup
import os
import json

script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(script_dir, "index.html")
output_path = os.path.join(script_dir, "elements-data.js")

with open(html_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

elements = []

def to_number(value):
    """Convert to float or int if possible, else None"""
    if value is None or value == "":
        return None
    try:
        if "." in value:
            return float(value)
        return int(value)
    except ValueError:
        return value

for g in soup.find_all("g", class_="element"):
    element = {
        "id": g.get("id"),
        "symbol": g.get("data-symbol"),
        "name": g.get("data-name"),
        "atomicNumber": to_number(g.get("data-atomic-number")),
        "mass": to_number(g.get("data-mass")),
        "group": g.get("data-group"),
        "period": to_number(g.get("data-period")),
        "block": g.get("data-block"),
        "category": g.get("data-category"),
        "state": g.get("data-state"),
        "appearance": g.get("data-appearance"),
        "density": to_number(g.get("data-density")),
        "meltingPoint": to_number(g.get("data-melting")),
        "boilingPoint": to_number(g.get("data-boiling")),
        "electronegativity": to_number(g.get("data-electronegativity")),
        "electronAffinity": to_number(g.get("data-affinity")),
        "ionizationEnergy": to_number(g.get("data-ionization")),
        "atomicRadius": to_number(g.get("data-radius")),
        "configuration": g.get("data-configuration"),
        "magnetic": g.get("data-magnetic"),
        "discoverer": g.get("data-discoverer"),
        "discoveryYear": to_number(g.get("data-year"))
    }

    if element["symbol"] and element["name"]:
        elements.append(element)

with open(output_path, "w", encoding="utf-8") as f:
    f.write("// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY\n")
    f.write("// Generated from index.html\n\n")
    f.write("const ELEMENTS = ")
    f.write(json.dumps(elements, indent=2, ensure_ascii=False))
    f.write(";\n")

print(f"Generated {len(elements)} elements into elements-data.js")
