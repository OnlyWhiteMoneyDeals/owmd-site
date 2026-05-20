import re
import os

def parse_css_classes(css_content):
    # Matches patterns like .class-name
    # Exclude @media, animation percentages, or pseudo-classes
    class_pattern = r'(?<![a-zA-Z0-9_-])\.([a-zA-Z0-9_-]+)(?![a-zA-Z0-9_-])'
    classes = set(re.findall(class_pattern, css_content))
    return sorted(list(classes))

def scan_html_and_js_for_classes(classes, base_path):
    unused_classes = set(classes)
    used_classes = {}
    
    # Files to scan
    scan_files = []
    for root, dirs, files in os.walk(base_path):
        # Exclude directories
        if '.git' in root or '.gemini' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith(('.html', '.js')) and not file.endswith('.min.js'):
                scan_files.append(os.path.join(root, file))
                
    print(f"Scanning {len(scan_files)} files: {[os.path.basename(f) for f in scan_files]}")
    
    for file_path in scan_files:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        for cls in list(unused_classes):
            # Check if class name is present in content
            # To be safe, check as word match or within quotes
            if cls in content:
                unused_classes.remove(cls)
                used_classes[cls] = os.path.basename(file_path)
                
    return sorted(list(unused_classes)), used_classes

def main():
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    css_path = os.path.join(base_path, 'css', 'style.css')
    
    if not os.path.exists(css_path):
        print(f"Error: CSS file not found at {css_path}")
        return
        
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    classes = parse_css_classes(css_content)
    print(f"Found {len(classes)} unique class names in CSS.")
    
    unused, used = scan_html_and_js_for_classes(classes, base_path)
    
    print("\n--- Summary of CSS Class Analysis ---")
    print(f"Used classes: {len(used)}")
    print(f"Unused classes: {len(unused)}")
    print("\nUnused CSS classes:")
    for i, cls in enumerate(unused, 1):
        print(f"{i}. .{cls}")

if __name__ == '__main__':
    main()
