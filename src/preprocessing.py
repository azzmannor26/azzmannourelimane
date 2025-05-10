import pandas as pd

def preprocess_data(stagiaires_df, stages_df, hr_requirements_df):
    # Merge stages with stagiaires
    merged = stages_df.merge(stagiaires_df, how='left',
                             left_on='stagiaire_id', right_on='users_id')
    
    # Convert dates
    merged['date_debut'] = pd.to_datetime(merged['date_debut'])
    merged['date_fin'] = pd.to_datetime(merged['date_fin'])
    hr_requirements_df['month'] = pd.to_datetime(hr_requirements_df['month'])
    hr_requirements_df['created_at'] = pd.to_datetime(hr_requirements_df['created_at'])

    # Calculate duration of each internship in days
    merged['duration_days'] = (merged['date_fin'] - merged['date_debut']).dt.days

    # Clean stipend (remove currency and convert to number)
    merged['stipend_clean'] = merged['stipend'].replace('[^0-9]', '', regex=True).astype(int)

    # Fill missing departments with "Unknown"
    merged['departement'] = merged['departement'].fillna('Unknown')

    return merged, hr_requirements_df


# Demo runner when file is executed directly
if __name__ == "__main__":
    from data_loader import load_stagiaires, load_stages, load_hr_requirements

    stagiaires = load_stagiaires()
    stages = load_stages()
    hr_reqs = load_hr_requirements()

    merged_data, cleaned_hr_reqs = preprocess_data(stagiaires, stages, hr_reqs)

    print("✅ Merged Data (first 5 rows):")
    print(merged_data.head())
    print("\n✅ Cleaned HR Requirements (first 5 rows):")
    print(cleaned_hr_reqs.head())
