# Pashudhan — In‑Browser Cattle/Buffalo Breed Identifier & Herd Manager

A compact, interview-friendly React + TypeScript demo that demonstrates
in-browser machine learning for cattle/buffalo breed identification,
alongside simple herd management UI. Built to show a complete client-side
ML pipeline (data ingestion, augmentation, training, inference, and
persistence) suitable for demos and interview walkthroughs.

Why this project
- Demonstrates a full in-browser ML workflow using TensorFlow.js.
- Shows pragmatic engineering trade-offs for client-side training and
	model persistence (IndexedDB).
- Provides a clean React codebase with an isolated ML service layer you
	can explain in interviews.

Highlights / Features
- In-browser breed classifier using `@tensorflow/tfjs` (transfer-learning style).
- Model training and demo UI: `components/ModelTraining.tsx`.
- Dataset utilities and augmentation: `services/datasetManager.ts`.
- ML wrapper and persistence: `services/breedClassifier.ts` (saves to IndexedDB).
- Image store and registration flow integrating breed suggestions.
- Lightweight React + Vite app for easy local development.

Tech stack
- React + TypeScript
- Vite (dev server + build)
- TensorFlow.js (`@tensorflow/tfjs`) for browser ML
- IndexedDB (via TensorFlow.js model save/load) for persistence

Quick start
1. Open a terminal in the project folder (root is the folder containing `package.json`).

```bash
cd D:\tmp\pashudhan\pashudhan
npm install
npm run dev    # starts Vite dev server (open http://localhost:3000)
```

Production build / preview

```bash
npm run build
npm run preview
```

Where to look (key files)
- App entry: `index.tsx` → `App.tsx`
- ML wrapper: `services/breedClassifier.ts`
- Dataset utils: `services/datasetManager.ts`
- Training UI: `components/ModelTraining.tsx`
- Breed recognition hook used by forms: `hooks/useBreedRecognition.ts`

Notes for demo / interview
- The app currently ships a synthetic/demo training path — bring a
	labeled dataset (many images per breed) to train a production model.
- Browser training is useful for demos but has memory/CPU limits; for
	realistic scale, perform transfer learning on a server and export a
	compact model for client inference.
- The model is saved to IndexedDB at `indexeddb://cattle-breed-classifier-v1`.

Interview talking points
- Why client-side ML? (privacy, offline-first, demo flexibility)
- Trade-offs: model size, latency, memory, battery usage on phones.
- Training strategies: transfer learning, data augmentation, balanced
	batching, early stopping, validation splits.
- Production optimizations: quantization, pruning, model conversion to
	TensorFlow Lite / WASM backends for mobile/edge.

How to contribute / next steps
- Add a real dataset: provide a manifest or use `services/datasetManager.ts`
	to load URLs or local uploads. Aim for 500–1000 images per breed for
	meaningful fine-tuning.
- Improve UX: simplify registration flows, add server-side training
	pipeline, or provide export/import for trained models.

License
MIT — feel free to fork and adapt this for demo and interview purposes.

Footnote
This README is written to be shareable on LinkedIn as a concise project
description; if you want, I can also generate a short one-paragraph
LinkedIn post caption based on this content.


Prerequisite: Node.js

1. Install dependencies with `npm install`
2. Add your API key to `.env.local`
3. Start the app with `npm run dev`
