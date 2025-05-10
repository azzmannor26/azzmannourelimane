import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

def train_predict_model(hr_df):
    df = hr_df.copy()

    # Feature Engineering
    df['month_num'] = df['month'].dt.month
    df['urgency_encoded'] = df['urgency_level'].map({'Low': 0, 'Medium': 1, 'High': 2})

    # One-hot encode departments
    enc = OneHotEncoder(sparse_output=False)
    dept_encoded = enc.fit_transform(df[['department']])
    dept_df = pd.DataFrame(dept_encoded, columns=enc.get_feature_names_out(['department']))
    df = pd.concat([df.reset_index(drop=True), dept_df], axis=1)

    # Features and Target
    X = pd.concat([df[['month_num', 'urgency_encoded']], dept_df], axis=1)
    y = df['num_interns']

    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)

    return model, enc, mse

def predict_number_of_interns(model, encoder, new_data):
    df = new_data.copy()
    df['month_num'] = df['month'].dt.month
    df['urgency_encoded'] = df['urgency_level'].map({'Low': 0, 'Medium': 1, 'High': 2})
    dept_encoded = encoder.transform(df[['department']])
    dept_df = pd.DataFrame(dept_encoded, columns=encoder.get_feature_names_out(['department']))
    X = pd.concat([df[['month_num', 'urgency_encoded']].reset_index(drop=True), dept_df], axis=1)
    return model.predict(X)
