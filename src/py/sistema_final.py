import cv2
import numpy as np
import pymongo
import certifi # Para el certificado SSL seguro
import time
from datetime import datetime

# ==========================================
# CONFIGURACIÓN DE INGENIERÍA (USER SETUP)
# ==========================================

# 1. PEGA AQUÍ TU LINK DE MONGO ATLAS ENTRE LAS COMILLAS:
MONGO_URI = "mongodb://agro-giovanni-db:ma4EbeqR62UbGOyfbkr4Ri5h7L1pk6laid5ORUZdtFpLNZQ2b0cdsqfnBxymjVtRMqE00CNxZkVDACDbow3izw==@agro-giovanni-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@agro-giovanni-db@"

# 2. NOMBRE DE TU BASE DE DATOS Y COLECCIÓN
DB_NAME = "agro_tech"
COLLECTION_NAME = "calidad_jitomate"

# ==========================================

def conectar_mongo():
    try:
        # Usamos tlsCAFile para evitar errores de SSL en Windows/Raspberry
        client = pymongo.MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        print("✅ CONEXIÓN A LA NUBE EXITOSA (MongoDB Atlas)")
        return collection
    except Exception as e:
        print(f"❌ ERROR DE CONEXIÓN: {e}")
        return None

def guardar_dato(collection, estado, calidad):
    if collection is None: return
    
    documento = {
        "sensor_id": "IOT-CAM-01",
        "fecha": datetime.now().strftime("%Y-%m-%d"),
        "hora": datetime.now().strftime("%H:%M:%S"),
        "timestamp": datetime.now(),
        "fruto": "Jitomate",
        "analisis": {
            "madurez": estado,
            "calidad": calidad
        }
    }
    try:
        collection.insert_one(documento)
        print(f"☁️ DATO SUBIDO: {estado} - {calidad}")
    except Exception as e:
        print(f"Error subiendo dato: {e}")

def iniciar_sistema():
    # Conexión a la Base de Datos
    col_mongo = conectar_mongo()

    # Cámara USB (Indice 1)
    cap = cv2.VideoCapture(1)
    
    # --- VALORES DE ORO (ESTÁNDAR) ---
    # Estos rangos separan el rojo del verde específicamente
    
    # VERDE (Limón/Jitomate verde)
    # H: 35 a 90 (El rango del color verde puro)
    # S: 50 a 255 (Saturación media-alta para ignorar lo blanco/gris)
    verde_bajo = np.array([35, 50, 50])
    verde_alto = np.array([90, 255, 255])

    # ROJO (Jitomate Maduro)
    # El rojo está al inicio (0-10) y al final (170-180) del espectro
    rojo_bajo1 = np.array([0, 100, 60])
    rojo_alto1 = np.array([10, 255, 255])
    
    rojo_bajo2 = np.array([170, 100, 60])
    rojo_alto2 = np.array([180, 255, 255])

    font = cv2.FONT_HERSHEY_SIMPLEX
    ultimo_envio = time.time()

    print("--- SISTEMA CORRIENDO ---")
    print("Presiona 'q' para salir")

    while True:
        ret, frame = cap.read()
        if not ret: break

        # Convertir a HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # --- MÁSCARAS ---
        mask_verde = cv2.inRange(hsv, verde_bajo, verde_alto)
        
        mask_r1 = cv2.inRange(hsv, rojo_bajo1, rojo_alto1)
        mask_r2 = cv2.inRange(hsv, rojo_bajo2, rojo_alto2)
        mask_rojo = cv2.add(mask_r1, mask_r2) # Unimos los dos rojos

        # Limpiar ruido visual (opcional, filtros morfológicos simples)
        kernel = np.ones((5,5), np.uint8)
        mask_verde = cv2.morphologyEx(mask_verde, cv2.MORPH_OPEN, kernel)
        mask_rojo = cv2.morphologyEx(mask_rojo, cv2.MORPH_OPEN, kernel)

        # --- DECISIÓN ---
        # Contamos cuántos píxeles hay de cada color
        pixeles_verde = cv2.countNonZero(mask_verde)
        pixeles_rojo = cv2.countNonZero(mask_rojo)

        estado = ""
        calidad = ""
        color_ui = (0,0,0)
        
        # Umbral de detección (debe haber al menos 3000 px de color para confirmar)
        umbral = 3000 

        if pixeles_rojo > umbral and pixeles_rojo > pixeles_verde:
            estado = "MADURO (Rojo)"
            calidad = "PRIMERA"
            color_ui = (0, 0, 255) # BGR: Rojo
        elif pixeles_verde > umbral and pixeles_verde > pixeles_rojo:
            estado = "INMADURO (Verde)"
            calidad = "SEGUNDA"
            color_ui = (0, 255, 0) # BGR: Verde

        # --- VISUALIZACIÓN ---
        if estado != "":
            # Dibujar rectángulo de información
            cv2.rectangle(frame, (20, 20), (400, 100), (0,0,0), -1)
            cv2.putText(frame, estado, (30, 50), font, 0.8, color_ui, 2)
            cv2.putText(frame, f"Calidad: {calidad}", (30, 85), font, 0.6, (255,255,255), 1)

            # --- ENVÍO A LA NUBE (Lógica IoT) ---
            # Solo enviamos 1 dato cada 5 segundos para no saturar
            if time.time() - ultimo_envio > 1:
                # Dibujar un círculo azul indicando "Subiendo datos..."
                cv2.circle(frame, (600, 50), 15, (255, 0, 0), -1)
                guardar_dato(col_mongo, estado, calidad)
                ultimo_envio = time.time()

        # Mostrar ventana
        cv2.imshow('Agro-Tech Vision System', frame)
        
        # Descomenta esto si quieres ver qué está detectando en blanco y negro
        # cv2.imshow('Debug Rojo', mask_rojo)
        # cv2.imshow('Debug Verde', mask_verde)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    iniciar_sistema()