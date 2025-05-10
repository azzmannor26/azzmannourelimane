import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend_profiles(requirement_df, past_data_df, top_n=3):
    requirement_df = requirement_df.copy()
    past_data_df = past_data_df.copy()

    # Filter by same department
    department = requirement_df.iloc[0]["department"]
    filtered_past = past_data_df[past_data_df["departement"] == department]

    # If no match in department, fallback to all
    if filtered_past.empty:
        filtered_past = past_data_df

    # Prepare text
    requirement_df["skills_str"] = requirement_df["needed_skills"].apply(lambda x: " ".join(x) if isinstance(x, list) else "")
    filtered_past["skills_str"] = filtered_past["sujet"].fillna("")

    # TF-IDF on filtered dataset only
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(
        requirement_df["skills_str"].tolist() + filtered_past["skills_str"].tolist()
    )

    req_vec = vectors[0]
    past_vecs = vectors[1:]

    similarities = cosine_similarity(req_vec, past_vecs).flatten()
    filtered_past["similarity"] = similarities

    # Sort by similarity + stipend + duration
    top_matches = (
        filtered_past.sort_values(by=["similarity", "stipend_clean", "duration_days"], ascending=False)
        .head(top_n)
    )

    return top_matches[["sujet", "departement", "stipend_clean", "duration_days"]]
