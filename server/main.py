from ariadne import QueryType, MutationType, make_executable_schema, load_schema_from_path
from ariadne.asgi import GraphQL
from catboost import CatBoostClassifier
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import numpy as np

model = CatBoostClassifier()
model.load_model("model")

type_defs = load_schema_from_path("schema.graphql")

query = QueryType()
mutation = MutationType()


def resolve_hello(*_):
    return "Hello..."  # What's next?


@mutation.field("prediction")
def resolve_prediction(_, info, age, restingBloodPressure, cholesterol, fastingBloodSugar, maxHeartRate, oldpeak, sex, chestPainType, restingECG, exerciseAngina, stSlope):

    data = np.array([
        age,
        restingBloodPressure,
        cholesterol,
        fastingBloodSugar,
        maxHeartRate,
        oldpeak,
        1 if sex == 'FEMALE' else 0,
        1 if sex == 'MALE' else 0,
        1 if chestPainType == 'ASY' else 0,
        1 if chestPainType == 'ATA' else 0,
        1 if chestPainType == 'NAP' else 0,
        1 if chestPainType == 'TA' else 0,
        1 if restingECG == 'LVH' else 0,
        1 if restingECG == 'NORMAL' else 0,
        1 if restingECG == 'ST' else 0,
        1 if exerciseAngina == 'NO' else 0,
        1 if exerciseAngina == 'YES' else 0,
        1 if stSlope == 'DOWN' else 0,
        1 if stSlope == 'FLAT' else 0,
        1 if stSlope == 'UP' else 0])

    return model.predict(data)


schema = make_executable_schema(type_defs, query, mutation)

app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.mount("/graphql", GraphQL(schema, debug=True))
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
