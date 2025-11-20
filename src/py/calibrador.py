import cv2
import numpy as np

def nada(x):
    pass

def iniciar_calibracion():
    # Usamos la cámara USB (indice 1)
    cap = cv2.VideoCapture(1)
    
    # Creamos una ventana para los controles
    cv2.namedWindow("Calibrador")
    
    # --- CREAR DESLIZADORES (TRACKBARS) ---
    # Rango: H (Matiz/Color) 0-179, S (Saturación) 0-255, V (Brillo) 0-255
    
    # Valores Iniciales (Bajos y Altos)
    cv2.createTrackbar("H_Min", "Calibrador", 0, 179, nada)
    cv2.createTrackbar("S_Min", "Calibrador", 0, 255, nada)
    cv2.createTrackbar("V_Min", "Calibrador", 0, 255, nada)
    
    cv2.createTrackbar("H_Max", "Calibrador", 179, 179, nada)
    cv2.createTrackbar("S_Max", "Calibrador", 255, 255, nada)
    cv2.createTrackbar("V_Max", "Calibrador", 255, 255, nada)

    print("--- INSTRUCCIONES ---")
    print("1. Coloca el objeto frente a la cámara.")
    print("2. Mueve los sliders hasta que el objeto se vea BLANCO y el fondo NEGRO.")
    print("3. Apunta esos valores.")
    print("Presiona 'q' para salir.")

    while True:
        ret, frame = cap.read()
        if not ret: break
        
        # Redimensionar un poco si la imagen es muy grande (opcional)
        frame = cv2.resize(frame, (640, 480))

        # Convertir a HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Leer valores de los sliders en tiempo real
        h_min = cv2.getTrackbarPos("H_Min", "Calibrador")
        s_min = cv2.getTrackbarPos("S_Min", "Calibrador")
        v_min = cv2.getTrackbarPos("V_Min", "Calibrador")
        
        h_max = cv2.getTrackbarPos("H_Max", "Calibrador")
        s_max = cv2.getTrackbarPos("S_Max", "Calibrador")
        v_max = cv2.getTrackbarPos("V_Max", "Calibrador")

        # Crear los arrays de límites
        limite_bajo = np.array([h_min, s_min, v_min])
        limite_alto = np.array([h_max, s_max, v_max])

        # Crear la máscara (Lo que el robot "ve")
        mask = cv2.inRange(hsv, limite_bajo, limite_alto)

        # Mostrar resultado
        # Unimos la imagen original y la máscara para verlas juntas
        cv2.imshow("Calibrador (Original vs Mascara)", mask)
        cv2.imshow("Referencia Color", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    iniciar_calibracion()