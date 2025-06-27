
# Contributing to SafeHelp

Welcome! SafeHelp is an open-source community project designed to help people quickly find free local services such as food, shelter, crisis support, and mental health care.

You can help bring SafeHelp to your city or improve the existing version for Nashua, NH.

---

## Ways You Can Contribute

### 1. Add Resources to Nashua
- Open `resources.json`
- Add a new entry in the same format
- Make sure to include:
  - name, address, category, open_hours, contact, youth_friendly, lat, lng
- Example:

```json
{
  "name": "Community Resource Center",
  "address": "123 Example St, Nashua, NH",
  "category": "Food",
  "open_hours": "Mon–Fri: 9am–5pm",
  "contact": "(603) 123-4567",
  "youth_friendly": true,
  "lat": 42.7600,
  "lng": -71.4600
}
```

---

### 2. Expand SafeHelp to a New City

- Fork this repository
- Duplicate the `resources.json` file and rename it (e.g., `resources_boston.json`)
- Update the file with data for your city
- In `App.js` and `MapView.js`, import your new file and update the map coordinates
- Deploy your version on Netlify or Vercel

---

### 3. Suggest a Resource

Don’t code? No problem!

Open an issue with the label `new-resource` and include:
- Name of the place
- Full address
- Type of help it offers
- Contact info and hours

We'll review and add it to the site.

---

## Setup Instructions

```bash
git clone https://github.com/YOUR_USERNAME/safehelp.git
cd safehelp
npm install
npm start
```

---

## Tech Stack

- React + Tailwind CSS
- Leaflet.js for maps
- JSON for data
- Hosted on Netlify

---

## Thanks for Helping

Together we can make local help easier to find in every community.
