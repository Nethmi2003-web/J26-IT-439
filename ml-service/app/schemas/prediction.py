from pydantic import BaseModel
from typing import List, Optional


class PredictionRequest(BaseModel):
    """
    Request schema for prediction endpoint.
    
    TO BE IMPLEMENTED:
    Add your input features here based on your ML model requirements.
    """
    features: List[float]
    
    class Config:
        json_schema_extra = {
            "example": {
                "features": [1.0, 2.0, 3.0]
            }
        }


class PredictionResponse(BaseModel):
    """
    Response schema for prediction endpoint.
    
    TO BE IMPLEMENTED:
    Update based on your model's output format.
    """
    prediction: Optional[float] = None
    confidence: Optional[float] = None
    message: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "prediction": 0.95,
                "confidence": 0.87,
                "message": "Prediction successful"
            }
        }


class TrainingRequest(BaseModel):
    """
    Request schema for training endpoint.
    
    TO BE IMPLEMENTED:
    Add parameters needed for model training.
    """
    dataset_path: str
    parameters: Optional[dict] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "dataset_path": "/path/to/dataset",
                "parameters": {
                    "learning_rate": 0.001,
                    "epochs": 100
                }
            }
        }


class MetricsResponse(BaseModel):
    """
    Response schema for metrics endpoint.
    
    TO BE IMPLEMENTED:
    Update with your model's performance metrics.
    """
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    message: str
