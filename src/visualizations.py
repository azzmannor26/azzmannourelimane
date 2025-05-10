import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os

sns.set(style="whitegrid")

# Folder where plots will be saved
STATIC_DIR = "static"
os.makedirs(STATIC_DIR, exist_ok=True)

def plot_interns_per_month(df):
    df['month'] = pd.to_datetime(df['date_debut']).dt.to_period('M').dt.to_timestamp()
    monthly_counts = df.groupby('month').size()
    plt.figure(figsize=(10, 5))
    monthly_counts.plot(kind='bar', color='skyblue')
    plt.title('Number of Interns Per Month')
    plt.ylabel('Count')
    plt.xlabel('Month')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(STATIC_DIR, "interns_per_month.png"))
    plt.close()

def plot_department_distribution(df):
    dept_counts = df['departement'].fillna("Unknown").value_counts()
    plt.figure(figsize=(8, 5))
    dept_counts.plot(kind='barh', color='salmon')
    plt.title('Intern Distribution by Department')
    plt.xlabel('Number of Interns')
    plt.ylabel('Department')
    plt.tight_layout()
    plt.savefig(os.path.join(STATIC_DIR, "department_distribution.png"))
    plt.close()

def plot_paid_vs_unpaid(df):
    paid_counts = df['is_paid'].fillna(False).astype(bool).value_counts()
    labels = ['Paid', 'Unpaid']
    plt.figure(figsize=(6, 6))
    plt.pie(paid_counts, labels=labels, autopct='%1.1f%%', startangle=90,
            colors=['lightgreen', 'lightcoral'])
    plt.title('Paid vs Unpaid Internships')
    plt.tight_layout()
    plt.savefig(os.path.join(STATIC_DIR, "paid_vs_unpaid.png"))
    plt.close()

def plot_stipend_distribution(df):
    plt.figure(figsize=(10, 5))
    sns.histplot(df['stipend_clean'].fillna(0), bins=10, kde=True, color='teal')
    plt.title('Stipend Distribution (USD)')
    plt.xlabel('Stipend')
    plt.ylabel('Number of Interns')
    plt.tight_layout()
    plt.savefig(os.path.join(STATIC_DIR, "stipend_distribution.png"))
    plt.close()

def plot_duration_distribution(df):
    plt.figure(figsize=(10, 5))
    sns.histplot(df['duration_days'].fillna(0), bins=10, kde=True, color='orange')
    plt.title('Internship Duration Distribution (days)')
    plt.xlabel('Duration (days)')
    plt.ylabel('Number of Interns')
    plt.tight_layout()
    plt.savefig(os.path.join(STATIC_DIR, "duration_distribution.png"))
    plt.close()

def run_all_visualizations(df):
    plot_interns_per_month(df)
    plot_department_distribution(df)
    plot_paid_vs_unpaid(df)
    plot_stipend_distribution(df)
    plot_duration_distribution(df)

# Optional for local testing
if __name__ == "__main__":
    from data_loader import load_stagiaires, load_stages, load_hr_requirements
    from preprocessing import preprocess_data

    stagiaires = load_stagiaires()
    stages = load_stages()
    hr_reqs = load_hr_requirements()
    merged_data, _ = preprocess_data(stagiaires, stages, hr_reqs)

    run_all_visualizations(merged_data)
