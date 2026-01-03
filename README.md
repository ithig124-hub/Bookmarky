# 🔖 Bookmarky

**Your personal reading log** - Save, organize, and revisit articles you've read.

## ✨ Features

- 📝 **Save Articles** - Store title, URL, tags, and personal notes
- 🏷️ **Organize with Tags** - Categorize your articles
- ✅ **Track Reading** - Mark articles as read/unread
- 🔍 **Search & Filter** - Find articles quickly
- 💾 **Local Storage** - All data stays in your browser
- 📱 **Mobile Friendly** - Works on all devices
- 🎨 **Beautiful Design** - Gold accents on black

## 🚀 Quick Start

### Option 1: Open Directly

1. Simply open `index.html` in your web browser
2. Start adding articles!

### Option 2: Run with Local Server

```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve
```

Then open `http://localhost:8000` in your browser.

### Option 3: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files from the Bookmarky folder
3. Go to Settings → Pages
4. Select main branch and save
5. Your app will be live at `https://yourusername.github.io/bookmarky`

## 📖 How to Use

### Adding an Article

1. Click **"Add Article"** button
2. Fill in:
   - **Title** (required)
   - **URL** (required)
   - **Tags** (optional, comma-separated)
   - **Notes** (optional)
3. Click **"Add Article"**

### Managing Articles

- **Mark as Read**: Click the circle icon
- **Edit**: Click the pencil icon
- **Delete**: Click the trash icon
- **Open Link**: Click the URL to visit

### Search & Filter

- Use the search bar to find by title, URL, or tags
- Filter by **All**, **Unread**, or **Read** status

## 📁 Files

```
Bookmarky/
├── index.html    # Main HTML file
├── styles.css    # All styling
├── app.js        # JavaScript functionality
└── README.md     # This file
```

## 💾 Data Storage

- All data stored in browser's localStorage
- Private and never leaves your device
- Persists between sessions
- Clearing browser data will delete bookmarks

## 🎨 Design

- **Colors**: Gold (#FFD700) on black
- **Framework**: Vanilla JavaScript (no dependencies!)
- **Size**: ~50KB total
- **Performance**: Instant loading

## 🌐 Browser Support

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🔒 Privacy

- No backend server
- No data collection
- No tracking
- 100% offline after first load

## 📱 Mobile Responsive

Fully optimized for:
- Desktop (1920px+)
- Tablet (768px-1920px)
- Mobile (375px-768px)

## 🛠️ Customization

To change colors, edit `styles.css`:

```css
/* Change gold accent to your color */
#FFD700 → Your color
#FFA500 → Your secondary color
```

## 💡 Tips

- Export your data by copying localStorage (Chrome DevTools → Application → Local Storage)
- Use descriptive tags for better organization
- Add notes for quick context later
- Clear read articles periodically

## 🐛 Troubleshooting

**Articles not saving?**
- Check if localStorage is enabled in your browser
- Make sure you're not in private/incognito mode

**Page not loading?**
- Check browser console for errors
- Try opening in a different browser
- Make sure all files are in the same folder

## 🚀 Future Ideas

- Export/Import JSON
- Dark/Light theme toggle
- Article screenshots
- Cloud sync option
- Browser extension

---

**Made with ❤️ using pure HTML, CSS, and JavaScript**

No frameworks. No build tools. Just open and use!