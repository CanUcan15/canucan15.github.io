from bs4 import BeautifulSoup
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(script_dir, "index.html")

# Dictionary of element properties
# Each element symbol maps to another dictionary of properties
properties = {
    "H":  {"radius": "120", "melting": "13.81", "boiling": "20.28", "density": "0.00008988", "state": "Gas", "appearance": "colorless gas", "discoverer": "", "year": "", "magnetic": ""},
    "He": {"radius": "140", "melting": "0.95", "boiling": "4.22", "density": "0.0001785", "state": "Gas", "appearance": "colorless gas", "discoverer": "", "year": "", "magnetic": ""},
    "Li": {"radius": "182", "melting": "453.65", "boiling": "1615", "density": "0.534", "state": "Solid", "appearance": "silvery-white metal", "discoverer": "", "year": "", "magnetic": ""},
    "Be": {"radius": "153", "melting": "1560", "boiling": "2744", "density": "1.85", "state": "Solid", "appearance": "steel gray metal", "discoverer": "", "year": "", "magnetic": ""},
    "B":  {"radius": "192", "melting": "2348", "boiling": "4273", "density": "2.37", "state": "Solid", "appearance": "black-brown solid", "discoverer": "", "year": "", "magnetic": ""},
    "C":  {"radius": "170", "melting": "3823", "boiling": "4098", "density": "2.2670", "state": "Solid", "appearance": "black (graphite) or transparent (diamond) solid", "discoverer": "", "year": "", "magnetic": ""},
    "N":  {"radius": "155", "melting": "63.15", "boiling": "77.36", "density": "0.0012506", "state": "Gas", "appearance": "colorless gas", "discoverer": "", "year": "", "magnetic": ""},
    "O":  {"radius": "152", "melting": "54.36", "boiling": "90.2", "density": "0.001429", "state": "Gas", "appearance": "colorless gas", "discoverer": "", "year": "", "magnetic": ""},
    "F":  {"radius": "135", "melting": "53.53", "boiling": "85.03", "density": "0.001696", "state": "Gas", "appearance": "pale yellow gas", "discoverer": "", "year": "", "magnetic": ""},
    "Ne": {"radius": "154", "melting": "24.56", "boiling": "27.07", "density": "0.0008999", "state": "Gas", "appearance": "colorless gas", "discoverer": "", "year": "", "magnetic": ""},
    "Na": {"radius": "227", "melting": "370.95", "boiling": "1156", "density": "0.97", "state": "Solid", "appearance": "silvery-white metal", "discoverer": "", "year": "", "magnetic": ""},
    "Mg": {"radius": "173", "melting": "923", "boiling": "1363", "density": "1.74", "state": "Solid", "appearance": "silvery-white metal", "discoverer": "", "year": "", "magnetic": ""},
    "Al": {"radius": "184", "melting": "933.437", "boiling": "2792", "density": "2.70", "state": "Solid", "appearance": "silvery-white metal", "discoverer": "", "year": "", "magnetic": ""},
    "Si": {"radius": "210", "melting": "1687", "boiling": "3538", "density": "2.3296", "state": "Solid", "appearance": "gray solid", "discoverer": "", "year": "", "magnetic": ""},
    "P":  {"radius": "180", "melting": "317.3", "boiling": "553.65", "density": "1.82", "state": "Solid", "appearance": "yellow (white phosphorus) or red (red phosphorus) solid", "discoverer": "", "year": "", "magnetic": ""},
    "S":  {"radius": "180", "melting": "388.36", "boiling": "717.75", "density": "2.067", "state": "Solid", "appearance": "yellow solid", "discoverer": "", "year": "", "magnetic": ""},
    "Cl": {"radius": "175", "melting": "171.65", "boiling": "239.11", "density": "0.003214", "state": "Gas", "appearance": "greenish-yellow gas", "discoverer": "", "year": "", "magnetic": ""},
    "Ar": {"radius": "188", "melting": "83.8", "boiling": "87.3", "density": "0.0017837", "state": "Gas", "appearance": "colorless gas", "discoverer": "", "year": "", "magnetic": ""},
    "K":  {"radius": "275", "melting": "336.53", "boiling": "1032", "density": "0.89", "state": "Solid", "appearance": "silvery metal", "discoverer": "", "year": "", "magnetic": ""},
    "Ca": {"radius": "231", "melting": "1115", "boiling": "1757", "density": "1.54", "state": "Solid", "appearance": "silvery metal", "discoverer": "", "year": "", "magnetic": ""},
    "Sc": {"radius": "211", "melting": "1814", "boiling": "3109", "density": "2.99", "state": "Solid", "appearance": "silvery-white metal", "discoverer": "", "year": "", "magnetic": ""},
    "Ti": {"radius": "187", "melting": "1941", "boiling": "3560", "density": "4.5", "state": "Solid", "appearance": "silvery metal", "discoverer": "", "year": "", "magnetic": ""},
    "V":  {"radius": "179", "melting": "2183", "boiling": "3680", "density": "6.0", "state": "Solid", "appearance": "gray metallic solid", "discoverer": "", "year": "", "magnetic": ""},
    "Cr": {"radius": "189", "melting": "2180", "boiling": "2944", "density": "7.15", "state": "Solid", "appearance": "silvery metallic solid", "discoverer": "", "year": "", "magnetic": ""},
    "Mn": {"radius": "197", "melting": "1519", "boiling": "2334", "density": "7.3", "state": "Solid", "appearance": "gray-white metal", "discoverer": "", "year": "", "magnetic": ""},
    "Fe": {"radius": "194", "melting": "1811", "boiling": "3134", "density": "7.874", "state": "Solid", "appearance": "lustrous metallic solid", "discoverer": "", "year": "", "magnetic": ""},
    "Co": {"radius": "192", "melting": "1768", "boiling": "3200", "density": "8.86", "state": "Solid", "appearance": "silvery-gray metal", "discoverer": "", "year": "", "magnetic": ""},
    "Ni": {"radius": "163", "melting": "1728", "boiling": "3186", "density": "8.912", "state": "Solid", "appearance": "lustrous metallic solid", "discoverer": "", "year": "", "magnetic": ""},
    "Cu": {"radius": "140", "melting": "1357.77", "boiling": "2835", "density": "8.933", "state": "Solid", "appearance": "reddish metallic solid", "discoverer": "", "year": "", "magnetic": ""},
    "Zn": {"radius": "139", "melting": "692.68", "boiling": "1180", "density": "7.134", "state": "Solid", "appearance": "bluish-silver metal", "discoverer": "", "year": "", "magnetic": ""},
    "Ga": {"radius": "187", "melting": "302.91", "boiling": "2477", "density": "5.91", "state": "Solid", "appearance": "silvery metal", "discoverer": "", "year": "", "magnetic": ""},
    "Ge": {"radius": "211", "melting": "1211.4", "boiling": "3106", "density": "5.323", "state": "Solid", "appearance": "grayish-white metalloid", "discoverer": "", "year": "", "magnetic": ""},
    "As": {"radius": "185", "melting": "1090", "boiling": "887", "density": "5.776", "state": "Solid", "appearance": "metallic gray", "discoverer": "", "year": "", "magnetic": ""},
    "Se": {"radius": "190", "melting": "493.65", "boiling": "958", "density": "4.809", "state": "Solid", "appearance": "gray, red, or black solid", "discoverer": "", "year": "", "magnetic": ""},
    "Br": {"radius": "183", "melting": "265.95", "boiling": "331.95", "density": "3.11", "state": "Liquid", "appearance": "reddish-brown liquid", "discoverer": "", "year": "", "magnetic": ""},
    "Kr": {"radius": "202", "melting": "115.79", "boiling": "119.93", "density": "0.003733", "state": "Gas", "appearance": "colorless gas", "discoverer": "", "year": "", "magnetic": ""}, 
    "Rb": {"radius": "303", "melting": "312.46", "boiling": "961", "density": "1.53", "state": "Solid", "appearance": "gray white", "discoverer": "Gustav Kirchhoff & Robert Bunsen", "year": "1861", "magnetic": "paramagnetic"},
    "Sr": {"radius": "249", "melting": "1050", "boiling": "1655", "density": "2.64", "state": "Solid", "appearance": "silvery white-yellow metallic", "discoverer": "William Cruickshank", "year": "1787", "magnetic": "paramagnetic"},
    "Y":  {"radius": "219", "melting": "1795", "boiling": "3618", "density": "4.47", "state": "Solid", "appearance": "silvery white", "discoverer": "Johan Gadolin", "year": "1794", "magnetic": "paramagnetic"},
    "Zr": {"radius": "186", "melting": "2128", "boiling": "4682", "density": "6.52", "state": "Solid", "appearance": "silvery white", "discoverer": "Martin Heinrich Klaproth", "year": "1789", "magnetic": "paramgnetic"},
    "Nb": {"radius": "207", "melting": "2750", "boiling": "5017", "density": "8.57", "state": "Solid", "appearance": "gray metallic", "discoverer": "Charles Hatchett", "year": "1801", "magnetic": "paramagnetic"},
    "Mo": {"radius": "209", "melting": "2896", "boiling": "4912", "density": "10.2", "state": "Solid", "appearance": "gray metallic", "discoverer": "Carl Wilhelm Scheele", "year": "1778", "magnetic": "paramagnetic"},
    "Tc": {"radius": "209", "melting": "2430", "boiling": "4538", "density": "11", "state": "Solid", "appearance": "shiny gray metal", "discoverer": "Dimitri Mendeleev", "year": "1871", "magnetic": "paramagnetic"},
    "Ru": {"radius": "207", "melting": "2607", "boiling": "4423", "density": "12.1", "state": "Solid", "appearance": "silvery white metallic", "discoverer": "Karl Ernst Claus", "year": "1844", "magnetic": "paramagnetic"},
    "Rh": {"radius": "195", "melting": "2237", "boiling": "3968", "density": "12.4", "state": "Solid", "appearance": "silvery white metallic", "discoverer": "William Hyde Wollaston", "year": "1804", "magnetic": "paramagnetic"},
    "Pd": {"radius": "202", "melting": "1828.05", "boiling": "3236", "density": "12.0", "state": "Solid", "appearance": "silvery white", "discoverer": "William Hyde Wollaston", "year": "1802", "magnetic": "paramagnetic"},
    "Ag": {"radius": "172", "melting": "1234.93", "boiling": "2435", "density": "10.501", "state": "Solid", "appearance": "lustrous white metal", "discoverer": "Unknown", "year": "before 5000 BC", "magnetic": "diamagnetic"},
    "Cd": {"radius": "158", "melting": "594.22", "boiling": "1040", "density": "8.69", "state": "Solid", "appearance": "silvery bluish-gray metallic", "discoverer": "Karl Samuel Leberecht Hermann & Friedrich Stromeyer", "year": "1817", "magnetic": "diamagnetic"},
    "In": {"radius": "193", "melting": "429.75", "boiling": "2345", "density": "7.31", "state": "Solid", "appearance": "silvery lustrous gray", "discoverer": "Ferdinand Reich & Hieronymous Theodor Richter", "year": "1863", "magnetic": "diamagnetic"},
    "Sn": {"radius": "217", "melting": "505.08", "boiling": "2875", "density": "7.287", "state": "Solid", "appearance": "silvery white (ß) or gray (α)", "discoverer": "Unknown", "year": "~35th century BC", "magnetic": "diamagnetic (α), paramagnetic (ß)"},
    "Sb": {"radius": "206", "melting": "903.78", "boiling": "1860", "density": "6.685", "state": "Solid", "appearance": "silvery lustrous gray", "discoverer": "Arabic alchemists", "year": "Before AD 815", "magnetic": "diamagnetic"},
    "Te": {"radius": "206", "melting": "722.66", "boiling": "1261", "density": "6.232", "state": "Solid", "appearance": "silvery lustrous gray or brown-black powder", "discoverer": "Franz-Joseph Müller von Reichenstein", "year": "1782", "magnetic": "diamagnetic"},
    "I":  {"radius": "198", "melting": "386.85", "boiling": "457.55", "density": "4.93", "state": "Solid", "appearance": "lustrous metallic gray", "discoverer": "Bernard Courtois", "year": "1811", "magnetic": "diamagnetic"},
    "Xe": {"radius": "216", "melting": "161.36", "boiling": "165.03", "density": "0.005887", "state": "Gas", "appearance": "colorless gas", "discoverer": "William Ramsay & Morris Travers", "year": "1898", "magnetic": "diamagnetic"},
    "Cs": {"radius": "343", "melting": "301.59", "boiling": "944", "density": "1.93", "state": "Solid", "appearance": "pale gold", "discoverer": "Gustav Kirchhoff & Robert Bunsen", "year": "1860", "magnetic": "paramagnetic"},
    "Ba": {"radius": "268", "melting": "1000", "boiling": "2170", "density": "3.62", "state": "Solid", "appearance": "silvery gray with a pale yellow tint", "discoverer": "Carl Wilhelm Scheele", "year": "1772", "magnetic": "paramagnetic"},
    "La": {"radius": "240", "melting": "1191", "boiling": "3737", "density": "6.15", "state": "Solid", "appearance": "silvery white", "discoverer": "Carl Gustaf Mosander", "year": "1838", "magnetic": "paramagnetic"},
    "Ce": {"radius": "235", "melting": "1071", "boiling": "3697", "density": "6.770", "state": "Solid", "appearance": "silvery white", "discoverer": "Martin Heinrich Klaproth, Wilhelm Hisinger & Jöns Jakob Berzelius", "year": "1803", "magnetic": "paramagnetic"},
    "Pr": {"radius": "239", "melting": "1204", "boiling": "3793", "density": "6.77", "state": "Solid", "appearance": "grayish white", "discoverer": "Carl Auer von Weisbach", "year": "1885", "magnetic": "paramagnetic"},
    "Nd": {"radius": "229", "melting": "1294", "boiling": "3347", "density": "7.01", "state": "Solid", "appearance": "silvery white", "discoverer": "Carl Gustaf Mosander", "year": "1841", "magnetic": "paramagnetic / antiferromagnetc (below 20 K)"},
    "Pm": {"radius": "236", "melting": "1315", "boiling": "3273", "density": "7.26", "state": "Solid", "appearance": "metallic", "discoverer": "Jacob A. Marinsky, Lawrence E. Glendenin & Charles D. Coryell", "year": "1945", "magnetic": "paramagnetic"},
    "Sm": {"radius": "229", "melting": "1347", "boiling": "2067", "density": "7.52", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Eu": {"radius": "233", "melting": "1095", "boiling": "1802", "density": "5.24", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Gd": {"radius": "237", "melting": "1586", "boiling": "3546", "density": "7.90", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Tb": {"radius": "221", "melting": "1629", "boiling": "3503", "density": "8.23", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Dy": {"radius": "229", "melting": "1685", "boiling": "2840", "density": "8.55", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Ho": {"radius": "216", "melting": "1747", "boiling": "2973", "density": "8.80", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Er": {"radius": "235", "melting": "1802", "boiling": "3141", "density": "9.07", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Tm": {"radius": "227", "melting": "1818", "boiling": "2223", "density": "9.32", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Yb": {"radius": "242", "melting": "1092", "boiling": "1469", "density": "6.90", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Lu": {"radius": "221", "melting": "1936", "boiling": "3675", "density": "9.84", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Hf": {"radius": "208", "melting": "2506", "boiling": "4876", "density": "13.3", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Ta": {"radius": "200", "melting": "3290", "boiling": "5731", "density": "16.4", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "W":  {"radius": "193", "melting": "3695", "boiling": "5828", "density": "19.3", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Re": {"radius": "188", "melting": "3459", "boiling": "5869", "density": "20.8", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Os": {"radius": "185", "melting": "3306", "boiling": "5285", "density": "22.57", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Ir": {"radius": "180", "melting": "2719", "boiling": "4701", "density": "22.42", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Pt": {"radius": "177", "melting": "2041.55", "boiling": "4098", "density": "21.46", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Au": {"radius": "174", "melting": "1337.33", "boiling": "3129", "density": "19.282", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Hg": {"radius": "151", "melting": "234.32", "boiling": "629.88", "density": "13.5336", "state": "Liquid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Tl": {"radius": "170", "melting": "577", "boiling": "1746", "density": "11.8", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Pb": {"radius": "175", "melting": "600.61", "boiling": "2022", "density": "11.342", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Bi": {"radius": "160", "melting": "544.55", "boiling": "1837", "density": "9.807", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Po": {"radius": "190", "melting": "527", "boiling": "1235", "density": "9.32", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "At": {"radius": "-" , "melting": "575", "boiling": "-", "density": "7", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Rn": {"radius": "-", "melting": "202", "boiling": "211.45", "density": "0.00973", "state": "Gas", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Fr": {"radius": "-", "melting": "300", "boiling": "-", "density": "5", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Ra": {"radius": "-", "melting": "973", "boiling": "1413", "density": "5", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Ac": {"radius": "-", "melting": "1324", "boiling": "3471", "density": "10.07", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Th": {"radius": "-", "melting": "2023", "boiling": "5061", "density": "11.72", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Pa": {"radius": "-", "melting": "1845", "boiling": "-", "density": "15.37", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "U":  {"radius": "-", "melting": "1408", "boiling": "4404", "density": "18.95", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Np": {"radius": "-", "melting": "917", "boiling": "4175", "density": "20.25", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Pu": {"radius": "-", "melting": "913", "boiling": "3501", "density": "19.84", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Am": {"radius": "-", "melting": "1449", "boiling": "2284", "density": "13.69", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Cm": {"radius": "-", "melting": "1618", "boiling": "3400", "density": "13.51", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Bk": {"radius": "-", "melting": "1323", "boiling": "-", "density": "14", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Cf": {"radius": "-", "melting": "1173", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Es": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Fm": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Md": {"radius": "-", "melting": "1100", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "No": {"radius": "-", "melting": "1100", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Lr": {"radius": "-", "melting": "1900", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Rf": {"radius": "-", "melting": "105", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Db": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Sg": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Bh": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Hs": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Mt": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Ds": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Rg": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Cn": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Nh": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Fl": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Mc": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Lv": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Ts": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""},
    "Og": {"radius": "-", "melting": "-", "boiling": "-", "density": "-", "state": "Solid", "appearance": "", "discoverer": "", "year": "", "magnetic": ""}
}

# Load your HTML file
with open(html_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

# Add data attributes to each element
for g in soup.find_all("g", class_="element"):
    symbol = g.get("data-symbol")
    if symbol in properties:
        for prop_name, value in properties[symbol].items():
            g[f"data-{prop_name}"] = value

# Save the updated HTML
output_path = os.path.join(script_dir, "index update.html")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(str(soup))

print("Completed successfully!")