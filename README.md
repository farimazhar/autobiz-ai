# AutoBiz AI

**Your AI copilot for everyday business operations.**

AutoBiz AI is an open-source starter application for small businesses and solo founders. It brings four useful workflows into one workspace:

- **Customer reply:** draft clear, professional customer support responses.
- **Invoice draft:** turn supplied sale details into an invoice draft and flag missing fields.
- **Order summary:** organize order details, spot missing information, and suggest next steps.
- **Business report:** turn raw notes and figures into a structured report.

## Tech stack

- Next.js 14 + React + TypeScript
- API route on the server (your API key is never sent to the browser)
- OpenAI-compatible chat completions API

## Run locally

1. Install Node.js 18.17+.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`.
4. Add your provider API key and model:

   ```env
   AI_API_KEY=your_api_key
   AI_BASE_URL=https://api.openai.com/v1
   AI_MODEL=gpt-4o-mini
   ```

   The API route supports OpenAI-compatible providers. For another provider, use its compatible base URL and model. Keep `.env.local` private and never commit it.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000.

## Important notes

- This is an MVP starter, not a complete accounting, CRM, or order-management system.
- Outputs are drafts. Review totals, tax rules, customer details, and business decisions before using them.
- No customer records are stored in a database in this starter.
- Do not paste payment card details, passwords, or other sensitive customer data into prompts.
- Add authentication, database storage, rate limiting, audit logs, and privacy controls before a public production launch.

## Roadmap

- [ ] User accounts and business profiles
- [ ] Saved drafts and customer history
- [ ] PDF invoice export
- [ ] Multi-language customer replies
- [ ] Integrations for email and ecommerce platforms
- [ ] Usage limits and paid plans

## Contributing

Contributions, bug reports, and feature suggestions are welcome. Please open an issue before large changes.

## License

MIT
