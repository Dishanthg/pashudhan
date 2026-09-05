# Breed Recognition Implementation

## What the app recognizes

The current classifier supports five labels configured in `services/breedModelConfig.ts`:

- Gir
- Sahiwal
- Punganur
- Red Sindhi
- Tharparkar

The breed library contains more reference information, but only these five labels are used by the recognition model.

## Runtime pipeline

The recognition flow starts in `components/RegistrationForm.tsx`:

1. The user selects or captures an image through `FileUpload`.
2. `useBreedRecognition` validates that the file is an image and is no larger than 4 MB.
3. The file is converted to a data URL and loaded into an `HTMLImageElement`.
4. `breedClassifier.loadModel()` initializes TensorFlow.js and loads MobileNet v2.
5. The classifier checks IndexedDB for a saved fine-tuned classification head.
6. The image is converted into a normalized MobileNet embedding.
7. The embedding is classified using either the saved head or reference prototypes.
8. The top label, confidence, alternatives, reasoning, model source, and image preview are returned to the form.
9. The result fills the breed field and the uploaded image is stored by `imageStore` when the animal is registered.

The prediction result is metadata from `data/breedData.ts` combined with the model's predicted label and confidence. The metadata provides the breed description, origin, characteristics, health information, lifespan, diet, temperament, milk yield, and draught capacity.

## Default prediction mode: reference prototypes

When no trained head exists, the app uses a lightweight reference-prototype classifier:

```text
Uploaded image
    |
    v
MobileNet v2 feature extractor
    |
    v
Normalized image embedding
    |
    +--> normalized reference embedding for Gir
    +--> normalized reference embedding for Sahiwal
    +--> normalized reference embedding for Punganur
    +--> normalized reference embedding for Red Sindhi
    +--> normalized reference embedding for Tharparkar
    |
    v
Cosine-like similarity scores -> softmax probabilities
    |
    v
Top breed + confidence + two alternatives
```

Reference images are defined in `DEFAULT_REFERENCE_IMAGE_URLS`. Each breed currently has one configured reference source. The classifier creates augmented variants of each reference image by using the original image, a horizontal flip, a brighter version, and a darker version. It averages those embeddings into one normalized prototype per breed.

This mode is useful as a browser demo and fallback, but it should not be presented as a certified production-grade breed test. A single reference image per label limits generalization to different animals, poses, lighting, backgrounds, and camera quality.

## Optional fine-tuned head

The `ModelTraining` screen can create a small trainable classification head on top of the frozen MobileNet embeddings:

```text
MobileNet embedding
    |
    v
Dense layer, 128 units, ReLU, L2 regularization
    |
    v
Dropout, 20%
    |
    v
Dense layer, 5 units, softmax
```

The training workflow in `components/ModelTraining.tsx`:

1. Loads the configured reference images through `DatasetManager`.
2. Augments each image with rotation, flip, and brightness changes.
3. Reports dataset statistics and splits the samples into training and validation sets.
4. Extracts MobileNet embeddings once for the training images.
5. Trains the small head with Adam and categorical cross-entropy.
6. Saves the head to browser IndexedDB at:

```text
indexeddb://cattle-breed-transfer-head-v1
```

On later page loads, `BreedClassifier` attempts to restore that head. When it is available, predictions use the fine-tuned head. The training screen also provides a reset action that removes the saved head and returns predictions to reference-prototype mode.

## Dataset manager

`services/datasetManager.ts` supports the training screen and exposes utilities for:

- Loading labeled remote images with optional CORS handling.
- Loading the configured bundled reference dataset.
- Creating synthetic cattle drawings for development experiments.
- Augmenting images with rotation, horizontal flip, and brightness changes.
- Splitting samples by breed while preserving label distribution.
- Reporting sample counts and balance statistics.

Synthetic images are useful for exercising the training code, but they are not a valid substitute for real, labeled cattle photographs and should not be used to claim recognition accuracy.

## Tensor and browser behavior

- TensorFlow.js prefers WebGL and falls back to the available backend when WebGL is unavailable.
- Embeddings, prototype tensors, output tensors, and trained heads are explicitly disposed where appropriate.
- MobileNet and the classifier are loaded lazily when the recognition hook initializes.
- Model training and saved heads are browser-local. Clearing site data removes the saved head.
- Remote reference images must load successfully and satisfy browser CORS rules.

## Accuracy and confidence

The displayed confidence is a model score, not a calibrated probability or official certainty measure. Confidence can be misleading when the uploaded animal is outside the five supported breeds or when the image has poor framing, lighting, or resolution.

For a production model:

- Collect hundreds of verified images per breed.
- Include multiple animals, ages, poses, seasons, cameras, and backgrounds.
- Keep animal identities separated between training and validation sets.
- Test on a held-out field dataset.
- Calibrate confidence and add an explicit `unknown` or `unsupported breed` class.
- Verify predictions against veterinary or breed-specialist review before using them for official records.
- Move training and sensitive model management to a controlled backend or build pipeline.

## Troubleshooting

### The model does not load

Check browser console errors, network access to the MobileNet model, IndexedDB availability, and WebGL support. Try clearing the saved model from the Model Training page or clearing site data.

### Reference images fail to load

Check the image URL, remote server availability, and CORS headers. A reference image that cannot be loaded prevents the prototype set from being complete.

### Predictions are weak

Use a clear image where the animal is visible, increase the number and variety of verified reference images, balance the dataset, and evaluate on images not used during training.

## Current Implementation Explained

The live application currently follows this exact path:

```text
RegistrationForm
    -> useBreedRecognition.recognizeBreed(file)
    -> breedClassifier.loadModel()
    -> MobileNet v2 feature extraction
    -> reference-prototype comparison OR saved fine-tuned head
    -> BreedPrediction
    -> breedData metadata
    -> breed field auto-filled in the registration form
```

### Normal recognition

When a user uploads an image, `RegistrationForm` passes the file to `useBreedRecognition`. The hook checks that the file is an image under 4 MB, converts it to a data URL, creates an image element, and calls `breedClassifier.predict`.

`BreedClassifier` loads MobileNet v2 as a pretrained feature extractor. It does not train MobileNet during normal recognition. Instead, it converts the uploaded image into an embedding and compares that embedding with reference embeddings for Gir, Sahiwal, Punganur, Red Sindhi, and Tharparkar. The highest score becomes the predicted breed, and the next two scores are returned as alternatives.

### Optional training

The Model Training screen uses `DatasetManager` to load the configured reference images, create augmented versions, split the dataset, and pass the images and labels to `breedClassifier.trainOnData`. The classifier extracts MobileNet embeddings and trains only a small five-class head. That head is saved in browser IndexedDB and automatically loaded during later predictions.

### Current storage and limitations

The model head is stored locally at `indexeddb://cattle-breed-transfer-head-v1`. It is not uploaded to a server and is not shared between browsers or users. The current implementation is suitable for demonstrating an in-browser ML workflow, but recognition confidence is not an official breed certification. Production use requires a larger verified dataset, an unknown-breed class, held-out evaluation, calibrated confidence, and server-side model and account management.
