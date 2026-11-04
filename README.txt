BIRTHDAY SURPRISE WEBSITE

Files:
- index.html: page structure and birthday messages
- style.css: visual design and responsive layout
- script.js: countdown and interactions
- assets/: six supplied photos and the supplied ringtone audio

BIRTHDAY DATE:
The countdown is set to 29 November 2026 at 12:00 AM India Standard Time.
To change the time, edit BIRTHDAY_AT near the top of script.js.

PREVIEW:
Open index.html in a browser. For best testing, use VS Code Live Server.
The countdown is date-based. To preview the unlocked birthday experience before 29 November, temporarily change BIRTHDAY_AT in script.js to a date/time in the past, then restore it before publishing.

GITHUB PAGES:
1. Create a GitHub repository (for example: birthday-surprise).
2. Upload index.html, style.css, script.js, README.txt and the assets folder. Keep the folder structure unchanged.
3. Open repository Settings > Pages.
4. Under Build and deployment, choose Deploy from a branch, select main and /(root), then Save.
5. Wait for GitHub Pages to publish and open the generated site URL.

PERSONALISE:
The letter, secret notes, final message and photo captions are currently warm generic messages. Edit their text in index.html and the captions array in script.js to make them personal. Replace the six files in assets only if you want different photos, keeping the same filenames.

MUSIC NOTE:
The music starts after the visitor taps the surprise button, because mobile browsers generally block autoplay before a user gesture. The visible music button can pause and resume it. Some phones may pause audio when the browser is backgrounded or the screen locks.

IMPORTANT:
GitHub Pages sites are public static websites. The countdown is a fun visual lock, not secure access control. Someone who knows the page URL and inspects its code may be able to bypass it. Do not place private information on the site.
