# REST API MOVIES

## Konfiguracja bazy danych

Po zainstalowaniu bazy danych należy podmienić konfigurację w pliku `index.js` (linie 15-21):

```js
const client = new Pool ({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432, // podaj port
    database: process.env.PGDB || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.POSTGRES_PASS || 'zaq1@WSX' // podaj hasło
});
```


## Uruchomienie backendu

Instalacja potrzebnych paczek:
```
yarn install
```

Uruchomienie backendu
```
yarn start
```

Projekt jest dostępny pod adresem:
```
http://localhost:3000
```


## Dostępne endpointy

```json
GET /movies // Pobieranie wszystkich filmów

// Response
[
    {
        "id": 1, 
        "title": "Zielona mila",
        "director": "Frank Darabont",
        "genre": "Dramat",
        "year": 1999,
        "description": "Emerytowany strażnik więzienny...",
        "image_url": "https://...",
        "rating_count": 7,
        "rating": 4
    }
]
```

```json
GET /movie/{id} // Pobieranie filmu o podanym id

// Response
{
    "id": 1, 
    "title": "Zielona mila",
    "director": "Frank Darabont",
    "genre": "Dramat",
    "year": 1999,
    "description": "Emerytowany strażnik więzienny...",
    "image_url": "https://...",
    "rating_count": 7,
    "rating": 4
}
```

```json
POST /movie // Dodawanie filmu

// Parameters - przykładowe body
{
    "title": "Zielona mila",
    "director": "Frank Darabont",
    "genre": "Dramat",
    "year": 1999, // wartość między 1000 a rokiem aktualnym
    "description": "Emerytowany strażnik więzienny...",
    "image_url": null
}

// Response
{
    "title": "Zielona mila", // unikalna wartość
    "director": "Frank Darabont",
    "genre": "Dramat",
    "year": 1999,
    "description": "Emerytowany strażnik więzienny...",
    "image_url": null, // może być nullem
    "rating_count": 7,
    "rating": 4
}
```

```json
PUT /movie/{id} // Edytowanie filmu o podanym id

// Parameters - przykładowe body
{
    "title": "Zielona mila", // unikalna wartość
    "director": "Frank Darabont",
    "genre": "Dramat",
    "year": 1999, // wartość między 1000 a rokiem aktualnym
    "description": "Emerytowany strażnik więzienny...",
    "image_url": "https://..." // może być nullem
}

// Response
{
    "title": "Zielona mila",
    "director": "Frank Darabont",
    "genre": "Dramat",
    "year": 1999,
    "description": "Emerytowany strażnik więzienny...",
    "image_url": null
}
```

```json
DELETE /movie/{id} // Usuwanie filmu o podanym id
```

```json
GET /movie/{id}/rate // Pobieranie oceny filmu dla podanego id filmu

// Response 
{
    "id": "1",
    "rating_count": 7,
    "rating": 4
}
```

```json
PATCH /movie/{id}/rate // Ocenianie filmu dla podanego id filmu

// Parameters - query
score // ?score={score}, gdzie wartość score wynosi między 1 a 5

// Response 
{
    "id": 1,
    "title": "Zielona mila",
    "director": "Frank Darabont",
    "genre": "Dramat",
    "year": 1999,
    "description": "Emerytowany strażnik więzienny...",
    "image_url": "https://...",
    "rating_count": 10,
    "rating": 4.3
}
```