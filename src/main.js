import './main.css'
import Alpine from 'alpinejs'

window.addEventListener('DOMContentLoaded', () => {
  console.log('--- Bootstrapping js Started ----');  
  Alpine.start()
});

document.addEventListener('alpine:init', async () => {
  console.log('alpine init executed... not sure why yet just for fun :D ')

  const url = "/api/techList.json";
  let allEntries;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    allEntries = await response.json();



    radar_visualization({
      repo_url: "https://github.com/zalando/tech-radar",
      svg_id: "radar",
      width: 1450,
      height: 1000,
      scale: 1.0,
      colors: {
        background: "#fff",
        grid: "#bbb",
        inactive: "#ddd"
      },
      // Some font families might lead to font size issues
      // Arial, Helvetica, or Source Sans Pro seem to work well though
      font_family: "Arial, Helvetica",
      title: "DK tech radar",
      quadrants: [
        { name: "Languages & Frameworks" },
        { name: "Platforms" },
        { name: "Techniques" },
        { name: "Tools" }
      ],
      rings: [
        { name: "ADOPT",  color: "#5ba300" },
        { name: "TRIAL", color: "#009eb0" },
        { name: "ASSESS",  color: "#c7ba00" },
        { name: "HOLD",  color: "#e09b96" }
      ],
      print_layout: true,
      links_in_new_tabs: true,
      entries: allEntries
    });
  } catch (error) {
    console.error(error.message);
  }
})