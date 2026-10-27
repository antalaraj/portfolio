from django.db import models
from apps.core.models import TimeStampedUUIDModel

class PortfolioEmbedding(TimeStampedUUIDModel):
    """
    Extensible model prepared for Phase 9 pgvector RAG embeddings.
    Stores semantic chunks of verified published portfolio items.
    """
    source_type = models.CharField(max_length=50) # 'project', 'experience', 'skill', 'education', 'bio'
    source_id = models.CharField(max_length=100)
    chunk_text = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Embedding chunk for {self.source_type} ({self.source_id})"
