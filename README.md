# A snippet to make your Google Fonts render faster

→ [googlefonts.3perf.com](https://googlefonts.3perf.com)

## What’s this?

When you use a custom font (like a font from Google Fonts),
[most modern browsers](https://developers.google.com/web/updates/2016/02/font-display#differences_in_font_rendering_today)
won’t render the text immediately. Instead, they will keep the text
hidden until the font is downloaded – or until 3 seconds pass. This hurts user experience –
[and affects business metrics](https://3perf.com/talks/web-perf-101/#perf-importance-header).

This repo includes a source of `googlefonts.3perf.com`, a tool that generates snippets that speed up Google Fonts rendering. See [the tool page](https://googlefonts.3perf.com) for more information on how it works.

## License

MIT © [Ivan Akulov](https://iamakulov.com)
