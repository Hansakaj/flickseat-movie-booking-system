
## Run

1) Install deps: `npm install`
2) Start dev: `npm run dev`

## Clerk (optional)

- Copy `.env.example` to `.env`
- Set `VITE_CLERK_PUBLISHABLE_KEY` to your Clerk Publishable Key
 In your Clerk dashboard, add an application and enable the Google and Apple OAuth providers
- Use the Clerk publishable key from your app settings in `.env`
- Start the app from the `front_end` folder: `npm run dev`

## Login flow

- The login modal opens from the navbar `Login` button
- The `/login` route also renders the login page
- Google and Apple buttons use Clerk OAuth once the publishable key is configured

- ## run web site

- open the new teminal.
- and then open the git bash
- write to the "npm run dev" then press enter
