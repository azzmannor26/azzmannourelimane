from data_loader import load_hr_requirements, load_stagiaires, load_stages
from preprocessing import preprocess_data
from model import train_predict_model, predict_number_of_interns
from recommender import recommend_profiles

hr = load_hr_requirements()
stagiaires = load_stagiaires()
stages = load_stages()
merged, cleaned_hr = preprocess_data(stagiaires, stages, hr)

model, encoder, mse = train_predict_model(cleaned_hr)
print("Model MSE:", mse)

# Predict on the latest HR requirement
predicted = predict_number_of_interns(model, encoder, cleaned_hr.tail(1))
print("Predicted interns needed:", predicted[0])

# Recommend similar profiles
recommendations = recommend_profiles(cleaned_hr.tail(1), merged)
print("Recommended profiles:")
print(recommendations)
