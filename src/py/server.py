from flask import Flask, jsonify
from flask_cors import CORS
import pymongo
import certifi # Necesario para Azure

app = Flask(__name__)
CORS(app) # Esto permite que tu React se conecte sin errores

# --- CONFIGURACIÓN AZURE ---
# Tu cadena de conexión real:
AZURE_URI = "mongodb://agro-giovanni-db:ma4EbeqR62UbGOyfbkr4Ri5h7L1pk6laid5ORUZdtFpLNZQ2b0cdsqfnBxymjVtRMqE00CNxZkVDACDbow3izw==@agro-giovanni-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@agro-giovanni-db@"

try:
    client = pymongo.MongoClient(AZURE_URI, tlsCAFile=certifi.where())
    db = client["agro_tech"]
    collection = db["calidad_jitomate"]
    print("✅ API Web conectada a Azure correctamente")
except Exception as e:
    print(f"❌ Error conectando API a Azure: {e}")

# --- RUTA PRINCIPAL (Para que no salga error 404 al entrar directo) ---
@app.route('/')
def home():
    return "<h1>¡Servidor Backend Agro-Tech EN LÍNEA! 🟢</h1><p>La API vive en <a href='/api/datos'>/api/datos</a></p>"

# --- RUTA DE DATOS (La que usa tu App) ---
@app.route('/api/datos', methods=['GET'])
def obtener_datos():
    try:
        # 1. Pedimos los datos SIN ordenar para evitar el error 400 de Azure
        # Traemos los últimos 20 registros tal cual están en la base
        cursor = collection.find({}, {'_id': 0}).limit(20)
        
        # 2. Convertimos a lista de Python
        datos = list(cursor)
        
        # 3. Ordenamos aquí en la RAM de tu compu
        # Al invertir la lista, los últimos que entraron quedan al principio
        datos.reverse() 
        
        return jsonify(datos)
    except Exception as e:
        print(f"Error en GET: {e}") 
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Correr en el puerto 5000 y accesible desde la red (0.0.0.0)
    app.run(debug=True, host='0.0.0.0', port=5000)