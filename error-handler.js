import html from "./html.js";
import { Component } from 'https://unpkg.com/preact@latest?module';

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error: error.message }
  }

  componentDidCatch(error) {
    console.error(error)
    this.setState({ error: error.message })
  }

  render() {
    if (this.state.error) {
      return html`<blockquote style="background-color: #fee">エラー発生: ${this.state.error}</blockquote>`
    }
    return this.props.children;
  }
}
