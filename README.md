# 🌙 Iftarly

**Iftarly** is a location-based Ramadan web application that shows accurate **Sahoor end time (Fajr)** and **Iftar time (Maghrib)** based on the user's current location.

It automatically detects your location, fetches prayer times, and displays a countdown to Iftar in a clean, modern interface.

---

## ✨ Features

- 📍 Automatic geolocation detection
- 🕌 Accurate Fajr and Maghrib times
- 🌙 Hijri date display
- ⏳ Live countdown to Iftar
- 🌍 Works globally
- 🌑 Dark modern UI
- ⚡ Fast and lightweight
- 🔄 API caching support
- 🛡 Proper error handling

---

## 🛠 Tech Stack

- Next.js 
- TypeScript
- Tailwind CSS
- Aladhan Prayer Times API
- Day.js

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/iftarly.git
cd iftarly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
/app
  page.tsx
  /api/prayer/route.ts

/components
  Countdown.tsx

/lib
  prayer.ts
```

---

## 🌍 How It Works

1. Browser requests location permission.
2. Latitude and longitude are retrieved.
3. Server route calls Aladhan Prayer Times API.
4. Fajr is shown as **Sahoor Ends**.
5. Maghrib is shown as **Iftar Time**.
6. Countdown updates every second.

---

## 🔐 API Endpoint

Prayer times are fetched server-side to avoid exposing the third-party API directly to the client.

Endpoint:

```
/api/prayer
```

Query parameters:

```
lat
lng
date
```

---

## ⚙ Configuration

You can change the prayer calculation method by modifying:

```
method=2
```

Common methods:

- 1: University of Islamic Sciences, Karachi
- 2: Islamic Society of North America
- 3: Muslim World League

---

## 🧠 Future Improvements

- PWA support
- 30-day Ramadan calendar view
- Multiple language support
- Calculation method selector
- Push notifications before Iftar
- User preferences storage

---

## 📦 Deployment

Recommended platforms:

- Vercel
- Netlify
- Self-hosted Node server

---

## 📜 License

MIT License

---

## 🤝 Contributing

Pull requests are welcome.  
Open an issue first for major changes.

---

## 🌙 About Iftarly

Iftarly simplifies fasting by providing accurate, location-aware prayer timings in a distraction-free interface.
