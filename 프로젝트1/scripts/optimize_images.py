from PIL import Image
import os

def optimize_image(filename):
    try:
        if not os.path.exists(filename):
            print(f"File not found: {filename}")
            return

        img = Image.open(filename)
        
        # Resize if too large (e.g., max width 500px for a logo is plenty)
        if img.width > 500:
            ratio = 500 / img.width
            new_height = int(img.height * ratio)
            img = img.resize((500, new_height), Image.Resampling.LANCZOS)
            print(f"Resized {filename} to 500px width")

        webp_filename = filename.replace('.png', '.webp')
        img.save(webp_filename, 'WEBP', quality=85)
        print(f"Converted {filename} -> {webp_filename}")
        
    except Exception as e:
        print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    optimize_image('lotto_logo.png')
    optimize_image('pension_logo.png')
