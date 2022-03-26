import html from './html.js';
import { render } from 'https://unpkg.com/preact@latest?module';
import shift2gcal from './scripts/shift2gcal.js';

import ErrorBoundary from './error-handler.js';

const apps = [
  shift2gcal
];

render(
  html`
    <div>
      <h1>Mendoi</h1>
      <nav>
        ${apps.map((app, i) => html`
          <ul>
            <li><a href="#${i}">${app.title}</a></li>
          </ul>
        `)}
      </nav>
      ${apps.map((app, i) => html`
        <section id="${i}">
          <h2>${app.title}</h2>
          <${ErrorBoundary}>
            <${app.app} />
          </${ErrorBoundary}>
        </section>
      `)}
    </div>
  `, document.body
)
