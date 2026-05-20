import re
import os

def minify_css(css):
    # Remove comments
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    # Remove whitespace
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([\{\};:,])\s*', r'\1', css)
    return css.strip()

def minify_js(js):
    # Very basic JS minification (remove comments and extra whitespace)
    js = re.sub(r'(?<!http:)(?<!https:)//.*?\n', '\n', js)
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    js = re.sub(r'\s*\n\s*', '\n', js)
    js = re.sub(r'[ \t]+', ' ', js)
    return js.strip()

# Dynamically calculate the root path of the project (parent of this scripts/ directory)
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Minify css/style.css
css_src = os.path.join(base_path, 'css', 'style.css')
css_dest = os.path.join(base_path, 'css', 'style.min.css')
if os.path.exists(css_src):
    with open(css_src, 'r', encoding='utf-8') as f:
        style_content = f.read()
    min_style = minify_css(style_content)
    with open(css_dest, 'w', encoding='utf-8') as f:
        f.write(min_style)
    print(f"Minified CSS: {css_src} -> {css_dest}")
else:
    print(f"Warning: CSS source not found at {css_src}")

# Minify js/script.js
js_src = os.path.join(base_path, 'js', 'script.js')
js_dest = os.path.join(base_path, 'js', 'script.min.js')
if os.path.exists(js_src):
    with open(js_src, 'r', encoding='utf-8') as f:
        script_content = f.read()
    min_script = minify_js(script_content)
    with open(js_dest, 'w', encoding='utf-8') as f:
        f.write(min_script)
    print(f"Minified JS: {js_src} -> {js_dest}")
else:
    print(f"Warning: JS source not found at {js_src}")

# Minify js/loader.js
loader_src = os.path.join(base_path, 'js', 'loader.js')
loader_dest = os.path.join(base_path, 'js', 'loader.min.js')
if os.path.exists(loader_src):
    with open(loader_src, 'r', encoding='utf-8') as f:
        loader_content = f.read()
    min_loader = minify_js(loader_content)
    with open(loader_dest, 'w', encoding='utf-8') as f:
        f.write(min_loader)
    print(f"Minified Loader: {loader_src} -> {loader_dest}")
else:
    print(f"Warning: Loader source not found at {loader_src}")

print("Asset compilation complete!")

