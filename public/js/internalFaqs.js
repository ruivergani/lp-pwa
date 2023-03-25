import faqs from './faqs.json' assert { type: "json" }

const container = document.getElementById("faqsContainer");

const faqsHTML = faqs.map(newsItem => {
  return `<li>
    <div class="collapsible-header">
        <p> ${newsItem.heading}</p>
        <i class="material-icons">add</i>
    </div>
    <div class="collapsible-body">
        <span> ${newsItem.text}</span>
    </div>
    </li>`;
    }).join("\n");
container.innerHTML = faqsHTML;