

# SafeHelp NE

**SafeHelp NE** is a free, open-source civic tech platform that helps people in New England find **local support services** such as food, housing, mental health care, and crisis support.

Originally launched for Nashua, NH, SafeHelp now supports **multi-city resource data**, and is designed to be expanded by local contributors and volunteers.

---

## Purpose

Many people in crisis — especially youth — don’t know where to go for help. Resources are scattered, outdated, or not user-friendly. SafeHelp New England solves this by:

- Centralizing trusted, free support services in one clean interface
- Displaying all locations on an interactive map
- Filtering by category (Food, Shelter, Mental Health, Crisis Support, etc.)
- Working on both mobile and desktop for easy access anywhere

---

## Who It's For

- People in need of basic support (food, housing, crisis response)
- Teens, students, and families in underserved areas
- Teachers, counselors, nonprofits, and outreach workers

---

## Features

- **Verified Local Listings** — real data from organizations in New England
- **Category Filters** — search by service type instantly
- **Map View** — interactive map with GPS pins and Google Maps links
- **Responsive Design** — mobile- and desktop-friendly UI
- **Open Submission Form** — anyone can suggest a new resource
- **Multi-City Support** — contributors can expand SafeHelp to their own towns

---

## Technologies Used

| Technology         | Purpose                                      |
|--------------------|----------------------------------------------|
| **React**          | Frontend framework for building UI           |
| **Tailwind CSS**   | Responsive styling and layout                |
| **Leaflet.js**     | Interactive maps                             |
| **React-Leaflet**  | React bindings for Leaflet                   |
| **Netlify**        | Hosting + auto deployment                    |
| **Git + GitHub**   | Version control and collaboration            |
| **JSON**           | Easy-to-edit structured local data           |

---

## Live Website

> [https://safehelpne.netlify.app](https://safehelpne.netlify.app)  
> _(Replace with your custom domain if using one)_

---

## Submit a New Resource

Want to add a food pantry, shelter, or youth-friendly service to the site?

Submit here:  
[**Submit a Resource Google Form**](https://docs.google.com/forms/d/e/1FAIpQLSeh7viSbU-5DT_9XzBUHczUpByAhi8Ve1zE0I8FZSUtbTAZ-Q/viewform?usp=dialog)

All submissions are reviewed before going live.

---

## Contribute to SafeHelp

You can bring SafeHelp to your town or expand it across your state.

### To add a new city:

1. Fork this repo
2. Open `resourcesByCity.json`
3. Add a new key like `"boston-ma": [ ... ]` with structured resources
4. Add the city name to the selector in `App.js`
5. Push and deploy your own copy (Netlify or Vercel)

### To submit a resource via GitHub:

You can also [open a new issue](https://github.com/YOUR_USERNAME/safehelp-ne/issues/new?template=new-resource.md) and paste in a formatted JSON snippet.

---

## Data Sources

- Southern New Hampshire Health Food Resource Guide (2025)
- NH Food Bank & local shelter websites
- Direct submissions via Google Form

---

## Future Plans

- Smart AI-based search assistant (natural language hint generator)
- Organization submission portal with approval flow
- Analytics dashboard for community orgs
- SMS or offline mode for underserved users

---

## Contact

Feel free to reach out via GitHub or email if you'd like to collaborate or discuss this project further.