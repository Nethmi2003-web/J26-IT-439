# Trained models directory - to be populated during training

This directory will contain trained ML models saved as joblib or pickle files.

## Directory Structure

```
trained_models/
├── model_v1.pkl          # Example trained model
├── model_v2.pkl          # Another version
├── scaler.pkl            # Fitted scaler
└── encoder.pkl           # Fitted encoder
```

## Notes

- Models are loaded by the API during inference
- Multiple model versions can be stored here
- Use joblib or pickle for model serialization
- Include any fitted preprocessors (scalers, encoders) needed for predictions

## Future Implementation

- Model versioning system
- Model metadata file (version, training date, performance metrics)
- Model loading strategy (latest, specific version, A/B testing)
