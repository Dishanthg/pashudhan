# Pashudhan

Pashudhan is a browser-based livestock management application for cattle and buffalo owners. It combines animal registration, breed recognition, breed reference information, herd records, milk production tracking, vaccination schedules, veterinary discovery, and account access in one React application.

## Features

- Username/password authentication stored locally for the demo.
- Optional Google Identity Services sign-in using `VITE_GOOGLE_CLIENT_ID`.
- Animal registration with tag, species, birth date, weight, vaccination notes, and photo.
- Browser-based breed recognition for Gir, Sahiwal, Punganur, Red Sindhi, and Tharparkar.
- Breed library with search and detailed breed information.
- Full-screen Herd Management workspace with milk records and vaccination records on the same page.
- Vaccination status tracking for completed, upcoming, due-soon, and overdue doses.
- Nearby veterinary clinic lookup.
- Browser model-training screen for creating and saving an optional classifier head.
- English, Hindi, and Kannada interface options.

## Technology

- React 19 and TypeScript
- Vite
- TensorFlow.js and MobileNet v2
- Tailwind-style utility classes with shared CSS in `styles/global.css`
- Browser `localStorage` for demo users and session data
- Browser IndexedDB through TensorFlow.js for a trained classifier head

## Run locally

Prerequisite: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Create a `.env` file for Google sign-in:

```env
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

The OAuth client must be a Web application client. Add the exact local origin and deployed Vercel origin to its authorized JavaScript origins.

## Production build

```bash
npm run build
npm run preview
```

For Vercel, use `npm run build` as the build command and `dist` as the output directory. Add `VITE_GOOGLE_CLIENT_ID` in the Vercel project environment variables and redeploy after changing it.

## Application flow

1. `index.tsx` mounts `App.tsx`.
2. `App.tsx` owns authentication state, the active view, herd state, theme, language, and browser history.
3. `LoginScreen` and `SignUpScreen` handle form input. `GoogleSignInButton` loads Google Identity Services and returns a credential.
4. `Dashboard` provides the main overview and navigation.
5. `RegistrationForm` uploads an image, calls `useBreedRecognition`, and adds the resulting animal to the in-memory herd.
6. `HerdManagement` displays milk production and vaccination workflows together, including validation, summaries, schedules, and delete actions.
7. `BreedDatabase`, `VetsNearby`, `AnimalProfile`, `Settings`, `AboutUs`, and `ModelTraining` provide the supporting workflows.

## Important storage note

This version is a browser-first demo. Users, sessions, the current herd, and herd-management records are not backed by a server database. They are local to the browser session or local storage used by the relevant feature. A production release should add a backend for users, authorization, herd records, and server-side Google token verification.

## Breed recognition summary

The recognition pipeline is documented in [ML_IMPLEMENTATION.md](ML_IMPLEMENTATION.md). In short, the app loads MobileNet v2, converts the uploaded image and breed reference images into normalized embeddings, and compares them against breed prototypes. If a saved fine-tuned head exists in IndexedDB, that head is used instead.

## Key files

- `App.tsx`: application state and view routing
- `components/RegistrationForm.tsx`: animal registration and recognition entry point
- `hooks/useBreedRecognition.ts`: image validation, model invocation, and result state
- `services/breedClassifier.ts`: MobileNet embeddings, prototype matching, optional training head, and persistence
- `services/breedModelConfig.ts`: supported breeds and reference image sources
- `services/datasetManager.ts`: reference loading, augmentation, splitting, and training statistics
- `components/ModelTraining.tsx`: optional in-browser training workflow
- `components/HerdManagement.tsx`: combined milk and vaccination workspace
- `data/breedData.ts`: breed metadata shown after recognition

## Limitations

- Breed recognition quality depends on reference images and the uploaded photo. It is a demo classifier, not a veterinary diagnosis or official breed certification.
- Public remote image URLs require network access and compatible CORS behavior.
- Client-side JWT decoding is not a substitute for server-side Google token verification.
- Browser model training can use substantial memory and may be slow on mobile devices.
