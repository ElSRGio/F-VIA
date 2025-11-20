import cv2

def probar_camara():
    print("Iniciando sistema de visión...")
    
    # IMPORTANTE: 
    # 0 suele ser la cámara integrada (webcam laptop)
    # 1 suele ser la cámara USB externa
    # Intenta con 1 primero. Si falla, cámbialo a 0.
    indice_camara = 1 
    
    cap = cv2.VideoCapture(indice_camara)

    if not cap.isOpened():
        print(f"ERROR: No se pudo abrir la cámara con índice {indice_camara}")
        print("Prueba cambiando el numero en 'indice_camara' a 0 o 2")
        return

    print("Cámara detectada correctamente. Presiona 'q' para salir.")

    while True:
        # Leer un cuadro (frame) de la cámara
        ret, frame = cap.read()
        
        if not ret:
            print("Error al recibir imagen (frame drop).")
            break

        # Mostrar la imagen en una ventana
        cv2.imshow('Prueba de Hardware - AgroSystem', frame)

        # Esperar la tecla 'q' para cerrar
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Liberar la cámara y cerrar ventanas
    cap.release()
    cv2.destroyAllWindows()
    print("Sistema finalizado.")

if __name__ == "__main__":
    probar_camara()