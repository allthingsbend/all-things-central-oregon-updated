import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pages = [
  {
    slug: "hiking",
    title: "Best Hikes Near Bend, Oregon",
    keyword: "best hikes near Bend Oregon",
    description: "A local guide to the best hikes near Bend, Oregon, including easy trails, scenic hikes, waterfalls, mountain views, and family-friendly options.",
  },
  {
    slug: "coffee",
    title: "Best Coffee Shops in Bend, Oregon",
    keyword: "best coffee shops in Bend Oregon",
    description: "A local guide to the best coffee shops in Bend, Oregon, including local roasters, cozy cafes, work-friendly spots, and drive-thru coffee.",
  },
  {
    slug: "breweries",
    title: "Best Breweries in Bend, Oregon",
    keyword: "best breweries in Bend Oregon",
    description: "A local guide to the best breweries in Bend, Oregon, including patios, food carts, family-friendly breweries, and local craft beer spots.",
  },
  {
    slug: "camping",
    title: "Camping Near Bend, Oregon",
    keyword: "camping near Bend Oregon",
    description: "A local guide to camping near Bend, Oregon, including campgrounds, lakeside camping, dispersed camping, RV camping, and seasonal tips.",
  },
  {
    slug: "fishing",
    title: "Fishing Near Bend, Oregon",
    keyword: "fishing near Bend Oregon",
    description: "A local guide to fishing near Bend, Oregon, including rivers, lakes, trout fishing, beginner-friendly spots, and seasonal tips.",
  },
  {
    slug: "family-activities",
    title: "Family Activities in Bend, Oregon",
    keyword: "family activities in Bend Oregon",
    description: "A local guide to the best family activities in Bend, Oregon, including kid-friendly hikes, parks, museums, lakes, easy outings, and rainy day ideas.",
  },
];

const sharedStyle = `
<style>
  .guide-hero {
    background: #f7f1e8;
    padding: 90px 0 70px;
    border-bottom: 1px solid #e7d8c5;
  }

  .container {
    width: min(1200px, 92%);
    margin: 0 auto;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: .12em;
    font-weight: 700;
    color: #b35c1e;
    margin-bottom: 12px;
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 4.6rem);
    line-height: 1.05;
    margin: 0 0 20px;
    color: #213f32;
  }

  .hero-text {
    max-width: 850px;
    font-size: 1.2rem;
    line-height: 1.75;
    color: #2d2d2d;
  }

  .section {
    padding: 70px 0;
  }

  .alt {
    background: #faf7f1;
  }

  h2 {
    font-size: clamp(1.8rem, 3vw, 2.3rem);
    margin-bottom: 18px;
    color: #213f32;
  }

  h3 {
    color: #213f32;
    margin-bottom: 8px;
  }

  p {
    line-height: 1.75;
  }

  .intro-grid,
  .two-col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
    margin-top: 30px;
  }

  .card,
  .panel,
  .quick-box {
    background: #fff;
    border: 1px solid #eadcc9;
    border-radius: 18px;
    padding: 26px;
    box-shadow: 0 8px 22px rgba(0,0,0,.04);
  }

  .link-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 26px;
  }

  .link-grid a {
    display: block;
    background: #fff;
    border: 1px solid #eadcc9;
    border-radius: 14px;
    padding: 20px;
    font-weight: 700;
    color: #213f32;
    text-decoration: none;
  }

  .faq {
    max-width: 920px;
  }

  .faq h3 {
    margin-top: 30px;
  }

  @media (max-width: 900px) {
    .intro-grid,
    .two-col,
    .card-grid,
    .link-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
`;

function cleanAstro(output) {
  return output
    .replace(/```astro/g, "")
    .replace(/```/g, "")
    .trim();
}

for (const page of pages) {
  const prompt = `
Create a complete Astro page for this local guide.

Page title: ${page.title}
Primary keyword: ${page.keyword}
Meta description: ${page.description}
URL: /bend/${page.slug}/

Use this import exactly:
---
import Layout from '../../../layouts/Layout.astro';

const title = '${page.title}';
const description = '${page.description}';
---

Requirements:
- Return only valid Astro code.
- Use <Layout title={title} description={description}>.
- Do not include markdown fences.
- Use the CSS class names already included below.
- Make the content useful, detailed, local, and non-generic.
- Include a hero section.
- Include a "Start Here" section.
- Include "Quick Picks".
- Include several helpful sections with cards.
- Include internal links to:
  /bend/things-to-do/
  /bend/restaurants/
  /bend/hiking/
  /bend/coffee/
  /bend/breweries/
  /bend/camping/
  /bend/fishing/
  /bend/family-activities/
- Include FAQs.
- Avoid fake exact claims like hours, prices, or current menus.
- Use this CSS at the bottom exactly:

${sharedStyle}
`;

  const response = await client.responses.create({
    model: "gpt-5.5",
    input: prompt,
  });

  const content = cleanAstro(response.output_text);

  const dir = path.join("src", "pages", "bend", page.slug);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "index.astro"), content);
  console.log(`Created /bend/${page.slug}/`);
}
