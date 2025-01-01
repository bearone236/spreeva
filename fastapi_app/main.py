from fastapi import FastAPI
from pydantic import BaseModel
from gensim import corpora, models
from sentence_transformers import SentenceTransformer, util
import nltk
from nltk.corpus import stopwords
import re
import numpy as np
import ssl
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://localhost:8000", 
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

# SSL対策
ssl._create_default_https_context = ssl._create_unverified_context

# 初期設定
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# モデルのロード
model = SentenceTransformer('all-MiniLM-L6-v2')

# FastAPIアプリケーションの作成
app = FastAPI()

# リクエストモデル
class EvaluationRequest(BaseModel):
    theme: str
    response: str

# レスポンスモデル
class EvaluationResponse(BaseModel):
    similarity_score: float
    diversity_score: float
    overall_score: float
    exact_matches: int
    penalty: float
    highlighted_words: list[str]


# スコア計算関数
def calculate_similarity_score(theme, response, model):
    theme_vector = model.encode(theme, convert_to_tensor=True)
    response_vector = model.encode(response, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(theme_vector, response_vector).item()
    
    theme_words = [word.lower() for word in re.findall(r'\b\w+\b', theme) if word.lower() not in stop_words]
    response_words = [word.lower() for word in re.findall(r'\b\w+\b', response) if word.lower() not in stop_words]
    
    matching_count = sum(1 for word in response_words if word in theme_words)
    
    penalty = 0
    if response.lower() == theme.lower():
        penalty += 0.3
    elif matching_count > 3:
        penalty += (matching_count - 3) * 0.02

    adjusted_similarity = max(0, similarity - penalty)

    return adjusted_similarity, matching_count, penalty

def highlight_related_words(theme, response):
    """
    抽出した関連性の高い単語を配列で返します。
    """
    theme_words = [word.lower() for word in re.findall(r'\b\w+\b', theme) if word.lower() not in stop_words]
    response_words = [word for word in re.findall(r'\b\w+\b', response)]
    
    highlighted_words = [word for word in response_words if word.lower() in theme_words]
    return highlighted_words

def calculate_topic_diversity(response, model, num_topics=3, passes=10):
    processed_response = re.sub(r"[^a-zA-Z\s]", "", response.lower())
    tokenized_response = [word for word in processed_response.split() if word not in stop_words]

    if len(tokenized_response) < 5:
        return 0.0

    dictionary = corpora.Dictionary([tokenized_response])
    corpus = [dictionary.doc2bow(tokenized_response)]
    lda_model = models.LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=passes, random_state=42)

    topic_words = []
    for topic in lda_model.show_topics(num_topics=num_topics, num_words=5, formatted=False):
        words = [word for word, _ in topic[1]]
        topic_words.append(" ".join(words))

    embeddings = model.encode(topic_words, convert_to_tensor=True)
    similarity_matrix = util.pytorch_cos_sim(embeddings, embeddings).cpu().numpy()
    avg_similarity = (np.sum(similarity_matrix) - np.trace(similarity_matrix)) / (len(topic_words) * (len(topic_words) - 1))
    diversity_score = 1 - avg_similarity

    return diversity_score

def calculate_overall_score(similarity_score, diversity_score, alpha=0.7, beta=0.3):
    overall_score = alpha * similarity_score + beta * diversity_score
    return round(overall_score, 2)

# APIエンドポイント
@app.post("/calculate-evaluation", response_model=EvaluationResponse)
async def calculate_evaluation(request: EvaluationRequest):
    theme = request.theme
    response = request.response

    similarity_score, exact_matches, penalty = calculate_similarity_score(
        theme, response, model
    )
    diversity_score = calculate_topic_diversity(response, model)
    overall_score = calculate_overall_score(similarity_score, diversity_score)
    highlighted_words = highlight_related_words(theme, response)


    return EvaluationResponse(
        similarity_score=similarity_score,
        diversity_score=diversity_score,
        overall_score=overall_score,
        exact_matches=exact_matches,
        penalty=penalty,
        highlighted_words=highlighted_words
    )