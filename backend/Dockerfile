FROM python:3.10

WORKDIR /app/backend

# Copier uniquement le fichier requirements.txt d'abord
COPY requirements.txt .

# Installer les dépendances avec plus de verbosité
RUN pip install --no-cache-dir -r requirements.txt -v

# Copier le reste des fichiers
COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]