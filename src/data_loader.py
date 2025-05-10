import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / 'data'

def load_stagiaires(csv_path=DATA_DIR / 'stagiaires.csv'):
    return pd.read_csv(csv_path)

def load_stages(csv_path=DATA_DIR / 'stages.csv'):
    return pd.read_csv(csv_path)

def load_hr_requirements(csv_path=DATA_DIR / 'hr_requirements.csv'):
    return pd.read_csv(csv_path)
