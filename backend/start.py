import uvicorn

if __name__ == "__main__":
    print("Iniciando o servidor FastAPI...")
    print("Host: 0.0.0.0 | Porta: 8080 | Reload: True | Log Level: debug")
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
        log_level="debug"
    )