import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { breedClassifier, type ModelInfo } from '../services/breedClassifier';
import { datasetManager } from '../services/datasetManager';
import '../styles/ModelTraining.css';

const formatMetric = (value: number | undefined): string => {
  if (value === undefined || Number.isNaN(value)) {
    return 'n/a';
  }

  return value.toFixed(4);
};

interface ModelTrainingProps {
  onBack?: () => void;
}

export const ModelTraining: React.FC<ModelTrainingProps> = ({ onBack }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo>(breedClassifier.getModelInfo());
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    setTrainingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);

    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const refreshModelInfo = () => {
    setModelInfo(breedClassifier.getModelInfo());
  };

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoadingModel(true);

      try {
        await breedClassifier.loadModel();
        refreshModelInfo();
      } catch (error) {
        addLog(`Model bootstrap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoadingModel(false);
      }
    };

    void bootstrap();
  }, []);

  const handleTrainFromBundledData = async () => {
    const totalEpochs = 10;

    setIsTraining(true);
    setTrainingLogs([]);
    setTrainingProgress(0);

    try {
      addLog('Loading pretrained MobileNet and current classifier state...');
      await breedClassifier.loadModel();
      refreshModelInfo();
      setTrainingProgress(10);

      addLog('Loading bundled breed reference photos...');
      const referenceDataset = await datasetManager.loadBundledReferenceDataset();
      setTrainingProgress(25);
      addLog(`Loaded ${referenceDataset.length} reference image(s) for ${referenceDataset.map(sample => sample.breedName).join(', ')}.`);

      addLog('Augmenting reference images to create a usable fine-tuning set...');
      const augmentedDataset = await datasetManager.augmentDataset(referenceDataset, 6);
      setTrainingProgress(45);
      addLog(`Expanded dataset to ${augmentedDataset.length} images.`);

      const stats = datasetManager.getStatistics(augmentedDataset);
      addLog(`Dataset balance score: ${stats.balance.toFixed(2)}.`);

      addLog('Splitting data into training and validation partitions...');
      const { train, validation } = datasetManager.splitDataset(augmentedDataset, 0.8);
      setTrainingProgress(55);
      addLog(`Train samples: ${train.length}. Validation samples: ${validation.length}.`);

      addLog('Training a saved transfer-learning head on top of MobileNet embeddings...');

      const history = await breedClassifier.trainOnData(
        train.map(sample => sample.image),
        train.map(sample => sample.label),
        {
          epochs: totalEpochs,
          batchSize: 8,
          validationSplit: 0.2,
          callbacks: {
            onEpochEnd: async (epoch, logs) => {
              const epochProgress = 55 + Math.round(((epoch + 1) / totalEpochs) * 40);
              setTrainingProgress(epochProgress);

              addLog(
                `Epoch ${epoch + 1}/${totalEpochs} - loss=${formatMetric(logs?.loss)} ` +
                `accuracy=${formatMetric((logs?.accuracy as number | undefined) ?? (logs?.acc as number | undefined))} ` +
                `val_loss=${formatMetric(logs?.val_loss as number | undefined)} ` +
                `val_accuracy=${formatMetric((logs?.val_accuracy as number | undefined) ?? (logs?.val_acc as number | undefined))}`
              );
            },
          },
        }
      );

      const finalAccuracy =
        (history.history.accuracy?.slice(-1)[0] as number | undefined) ??
        (history.history.acc?.slice(-1)[0] as number | undefined);
      const finalValAccuracy =
        (history.history.val_accuracy?.slice(-1)[0] as number | undefined) ??
        (history.history.val_acc?.slice(-1)[0] as number | undefined);

      setTrainingProgress(100);
      addLog(`Training complete. Final training accuracy: ${formatMetric(finalAccuracy)}.`);
      addLog(`Final validation accuracy: ${formatMetric(finalValAccuracy)}.`);
      addLog('Saved fine-tuned model head to browser IndexedDB. Future predictions now use the trained model.');

      refreshModelInfo();
    } catch (error) {
      addLog(`Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handleResetModel = async () => {
    setIsResetting(true);

    try {
      await breedClassifier.clearSavedModel();
      refreshModelInfo();
      addLog('Removed saved fine-tuned head. Predictions reverted to the pretrained MobileNet reference model.');
    } catch (error) {
      addLog(`Reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="model-training-container">
      {onBack && (
        <button className="training-back-button" onClick={onBack} type="button">
          <Icon name="arrow-left" className="training-back-icon" />
          <span>Back to Dashboard</span>
        </button>
      )}

      <div className="training-header">
        <h2>Breed Model Training</h2>
        <p>Fine-tune the browser model on bundled breed references and keep the saved result for later sessions.</p>
      </div>

      <div className="training-status-grid">
        <div className="status-card">
          <span className="status-label">Current mode</span>
          <strong className="status-value">
            {modelInfo.source === 'fine-tuned-head' ? 'Fine-tuned head' : 'Pretrained reference model'}
          </strong>
        </div>
        <div className="status-card">
          <span className="status-label">Supported breeds</span>
          <strong className="status-value">{modelInfo.labels.join(', ')}</strong>
        </div>
        <div className="status-card">
          <span className="status-label">Saved model</span>
          <strong className="status-value">{modelInfo.usingSavedHead ? 'Available' : 'Not saved yet'}</strong>
        </div>
      </div>

      <div className="training-options">
        <button
          className="btn btn-primary"
          onClick={handleTrainFromBundledData}
          disabled={isTraining || isLoadingModel}
        >
          {isTraining ? 'Training in progress...' : 'Train from Bundled References'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleResetModel}
          disabled={isTraining || isLoadingModel || isResetting || !modelInfo.usingSavedHead}
        >
          {isResetting ? 'Reverting...' : 'Revert to Pretrained Model'}
        </button>
      </div>

      {(isTraining || isLoadingModel) && (
        <div className="progress-section">
          <div className="progress-meta">
            <span>{isLoadingModel ? 'Preparing model...' : 'Training progress'}</span>
            <span>{trainingProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${trainingProgress}%` }}></div>
          </div>
        </div>
      )}

      <div className="training-logs">
        <h3>Training Log</h3>
        <div className="logs-content">
          {trainingLogs.length === 0 ? (
            <div className="log-line">No training run yet. Start a run to see each stage and epoch here.</div>
          ) : (
            trainingLogs.map((log, index) => (
              <div key={index} className="log-line">
                {log}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      <div className="training-info">
        <h4>What this does</h4>
        <ul>
          <li>Always starts from a real pretrained MobileNet feature extractor instead of random weights.</li>
          <li>Builds a small fine-tuned classifier head using bundled breed reference images plus augmentation.</li>
          <li>Saves the trained head to IndexedDB so the browser loads it on the next visit.</li>
          <li>Keeps a one-click fallback to the pretrained reference model if you want to discard local training.</li>
        </ul>
      </div>
    </div>
  );
};
