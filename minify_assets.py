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
    # Note: This is a simple regex-based approach. 
    js = re.sub(r'//.*?\n', '\n', js)
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    js = re.sub(r'\s*\n\s*', '\n', js)
    js = re.sub(r'[ \t]+', ' ', js)
    return js.strip()

base_path = '/Users/kunaljakhotiya/Downloads/owmd-site 3'

# Minify style.css
with open(os.path.join(base_path, 'style.css'), 'r') as f:
    style_content = f.read()
min_style = minify_css(style_content)
with open(os.path.join(base_path, 'style.min.css'), 'w') as f:
    f.write(min_style)

# Minify script.js
with open(os.path.join(base_path, 'script.js'), 'r') as f:
    script_content = f.read()
min_script = minify_js(script_content)
with open(os.path.join(base_path, 'script.min.js'), 'w') as f:
    f.write(min_script)

print("Minification complete: style.min.css and script.min.js created.")
