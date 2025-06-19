from fastapi import APIRouter, Depends, Query, HTTPException, Response
from fastapi.responses import FileResponse
from pymongo.collection import Collection
from app.logging.mongo_connection import collection
from typing import Optional
from datetime import datetime
import pandas as pd
import json
import os
from app.logging.log_setup import logger

router = APIRouter(prefix="/logs", tags=["logs"])

def get_mongo_collection() -> Collection:
    if collection is None:
        logger.error("MongoDB collection non initialisée")
        raise HTTPException(status_code=500, detail="MongoDB collection non initialisée")
    return collection

@router.get("/", response_model=list[dict])
async def get_all_logs(
    skip: int = Query(0, ge=0, description="Nombre de logs à sauter"),
    limit: int = Query(100, ge=1, le=1000, description="Nombre maximum de logs à retourner"),
    mongo_collection: Collection = Depends(get_mongo_collection)
):
    """
    Récupère tous les logs avec pagination.
    """
    try:
        logs = list(mongo_collection.find().skip(skip).limit(limit))
        # Convertir ObjectId en str pour JSON
        for log in logs:
            log["_id"] = str(log["_id"])
        logger.info(
            "Récupération des logs réussie",
            extra={
                "category": "api",
                "details": {"skip": skip, "limit": limit, "count": len(logs)}
            }
        )
        return logs
    except Exception as e:
        logger.error(
            "Échec de la récupération des logs",
            extra={"category": "error", "details": {"error": str(e)}}
        )
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des logs : {str(e)}")

@router.get("/export")
async def export_logs(
    format: str = Query("json", enum=["json", "csv"], description="Format d'exportation (json ou csv)"),
    mongo_collection: Collection = Depends(get_mongo_collection)
):
    """
    Exporte tous les logs dans un fichier JSON ou CSV.
    """
    try:
        logs = list(mongo_collection.find())
        for log in logs:
            log["_id"] = str(log["_id"])
            log["timestamp"] = log["timestamp"]  # Assurer que timestamp est en string ISO

        if format == "json":
            file_path = "logs_export.json"
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(logs, f, ensure_ascii=False, indent=2)
            logger.info(
                "Exportation des logs en JSON réussie",
                extra={"category": "export", "details": {"format": "json", "count": len(logs)}}
            )
            return FileResponse(file_path, filename="logs_export.json", media_type="application/json")

        elif format == "csv":
            df = pd.DataFrame(logs)
            file_path = "logs_export.csv"
            df.to_csv(file_path, index=False, encoding="utf-8")
            logger.info(
                "Exportation des logs en CSV réussie",
                extra={"category": "export", "details": {"format": "csv", "count": len(logs)}}
            )
            return FileResponse(file_path, filename="logs_export.csv", media_type="text/csv")

    except Exception as e:
        logger.error(
            "Échec de l'exportation des logs",
            extra={"category": "error", "details": {"error": str(e)}}
        )
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'exportation des logs : {str(e)}")

@router.get("/search", response_model=list[dict])
async def search_logs(
    category: Optional[str] = Query(None, description="Catégorie du log (ex: prediction, error)"),
    user_id: Optional[str] = Query(None, description="ID de l'utilisateur"),
    transaction_id: Optional[str] = Query(None, description="ID de la transaction"),
    level: Optional[str] = Query(None, enum=["DEBUG", "INFO", "WARNING", "ERROR"], description="Niveau du log"),
    start_date: Optional[str] = Query(None, description="Date de début (ISO format, ex: 2025-06-16T00:00:00)"),
    end_date: Optional[str] = Query(None, description="Date de fin (ISO format, ex: 2025-06-16T23:59:59)"),
    skip: int = Query(0, ge=0, description="Nombre de logs à sauter"),
    limit: int = Query(100, ge=1, le=1000, description="Nombre maximum de logs à retourner"),
    mongo_collection: Collection = Depends(get_mongo_collection)
):
    """
    Recherche des logs avec des filtres.
    """
    try:
        query = {}
        if category:
            query["category"] = category
        if user_id:
            query["user_id"] = user_id
        if transaction_id:
            query["transaction_id"] = transaction_id
        if level:
            query["level"] = level
        if start_date or end_date:
            query["timestamp"] = {}
            if start_date:
                query["timestamp"]["$gte"] = start_date
            if end_date:
                query["timestamp"]["$lte"] = end_date

        logs = list(mongo_collection.find(query).skip(skip).limit(limit))
        for log in logs:
            log["_id"] = str(log["_id"])

        logger.info(
            "Recherche des logs réussie",
            extra={
                "category": "api",
                "details": {
                    "query": query,
                    "skip": skip,
                    "limit": limit,
                    "count": len(logs)
                }
            }
        )
        return logs
    except Exception as e:
        logger.error(
            "Échec de la recherche des logs",
            extra={"category": "error", "details": {"error": str(e)}}
        )
        raise HTTPException(status_code=500, detail=f"Erreur lors de la recherche des logs : {str(e)}")