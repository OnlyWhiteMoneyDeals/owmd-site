import os
import re
import sys

def verify_all():
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"Scanning directory: {base_path}")
    
    html_files = [f for f in os.listdir(base_path) if f.endswith('.html')]
    if not html_files:
        print("Error: No HTML files found in root directory!")
        sys.exit(1)
        
    print(f"Found HTML files to verify: {html_files}")
    
    errors = 0
    warnings = 0
    
    for html_file in html_files:
        print(f"\nVerifying {html_file}...")
        file_path = os.path.join(base_path, html_file)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. Verify Stylesheet Links
        link_hrefs = re.findall(r'<link[^>]*href=["\']([^"\']+)["\']', content)
        for href in link_hrefs:
            # Skip external links
            if href.startswith(('http://', 'https://', '//', 'mailto:', 'tel:')):
                continue
            
            # Check local file
            # Remove hash or query params if any
            clean_href = href.split('?')[0].split('#')[0]
            if clean_href.startswith('/'):
                clean_href = clean_href.lstrip('/')
            asset_path = os.path.join(base_path, clean_href)
            if not os.path.exists(asset_path):
                print(f"  🔴 [ERROR] Broken Link Ref: {href} (Calculated: {clean_href})")
                errors += 1
            else:
                print(f"  🟢 [OK] CSS/Link: {href}")
                
        # 2. Verify Script Src Links
        script_srcs = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', content)
        for src in script_srcs:
            if src.startswith(('http://', 'https://', '//')):
                continue
            
            clean_src = src.split('?')[0].split('#')[0]
            if clean_src.startswith('/'):
                clean_src = clean_src.lstrip('/')
            asset_path = os.path.join(base_path, clean_src)
            if not os.path.exists(asset_path):
                print(f"  🔴 [ERROR] Broken Script Ref: {src} (Calculated: {clean_src})")
                errors += 1
            else:
                print(f"  🟢 [OK] Script: {src}")
                
        # 3. Verify Image Src Links
        img_srcs = re.findall(r'<img[^>]*src=["\']([^"\']+)["\']', content)
        # Also find srcset references
        srcset_refs = re.findall(r'srcset=["\']([^"\']+)["\']', content)
        for srcset in srcset_refs:
            # Parse srcset: e.g. "assets/responsive/hero_bg-600.jpg 600w, assets/responsive/hero_bg-1200.jpg 1200w"
            parts = re.split(r',\s*', srcset)
            for part in parts:
                match = re.match(r'^([^\s]+)', part.strip())
                if match:
                    img_srcs.append(match.group(1))
                    
        # Check inline background images as well (e.g. url('assets/responsive/hero_bg-600.jpg'))
        bg_imgs = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', content)
        img_srcs.extend(bg_imgs)

        for src in set(img_srcs):
            if src.startswith(('http://', 'https://', '//', 'data:')) or '${' in src:
                continue
            
            clean_src = src.split('?')[0].split('#')[0]
            if clean_src.startswith('/'):
                clean_src = clean_src.lstrip('/')
            asset_path = os.path.join(base_path, clean_src)
            if not os.path.exists(asset_path):
                print(f"  🔴 [ERROR] Broken Image Ref: {src} (Calculated: {clean_src})")
                errors += 1
            else:
                # Basic output throttling for image OKs to keep it readable
                pass
                
        # 4. Verify Local Anchors (Internal navigation)
        anchors = re.findall(r'<a[^>]*href=["\']([^"\']+)["\']', content)
        for href in anchors:
            if href.startswith(('http://', 'https://', '//', 'mailto:', 'tel:', '#')) or href == '':
                continue
            
            clean_href = href.split('?')[0].split('#')[0]
            if clean_href.startswith('/'):
                clean_href = clean_href.lstrip('/')
            if clean_href.endswith('.html'):
                asset_path = os.path.join(base_path, clean_href)
                if not os.path.exists(asset_path):
                    print(f"  🔴 [ERROR] Broken Navigation Anchor: {href}")
                    errors += 1
                else:
                    # Navigation verified
                    pass

    # Verify js/loader.js partial loads as well
    loader_path = os.path.join(base_path, 'js', 'loader.js')
    if os.path.exists(loader_path):
        print("\nVerifying partials loaded in loader.js...")
        with open(loader_path, 'r', encoding='utf-8') as f:
            loader_content = f.read()
        # Find partial URLs like 'partials/navbar.html'
        partials = re.findall(r'[\'"](partials/[^\'"]+)[\'"]', loader_content)
        for partial in partials:
            partial_path = os.path.join(base_path, partial)
            if not os.path.exists(partial_path):
                print(f"  🔴 [ERROR] Broken Partial reference in loader: {partial}")
                errors += 1
            else:
                print(f"  🟢 [OK] Partial: {partial}")

    print("\n" + "="*40)
    if errors == 0:
        print("🎉 SUCCESS: All local assets and internal links verified successfully!")
        sys.exit(0)
    else:
        print(f"❌ FAILURE: Found {errors} broken reference(s)!")
        sys.exit(1)

if __name__ == '__main__':
    verify_all()
