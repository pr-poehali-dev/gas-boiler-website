import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с отзывами на котлы
    GET /reviews?boiler_id=1 - получить отзывы по котлу
    POST /reviews - добавить новый отзыв
    """
    method = event.get('httpMethod', 'GET')
    
    # Обработка CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Подключение к базе данных
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        if method == 'GET':
            # Получение отзывов
            query_params = event.get('queryStringParameters') or {}
            boiler_id = query_params.get('boiler_id')
            
            if boiler_id:
                cursor.execute("""
                    SELECT id, boiler_id, name, rating, comment, created_at
                    FROM reviews 
                    WHERE boiler_id = %s AND is_approved = true 
                    ORDER BY created_at DESC
                """, (int(boiler_id),))
            else:
                cursor.execute("""
                    SELECT id, boiler_id, name, rating, comment, created_at
                    FROM reviews 
                    WHERE is_approved = true 
                    ORDER BY created_at DESC
                    LIMIT 50
                """)
            
            reviews = []
            for row in cursor.fetchall():
                reviews.append({
                    'id': row[0],
                    'boiler_id': row[1],
                    'name': row[2],
                    'rating': row[3],
                    'comment': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'reviews': reviews})
            }
        
        elif method == 'POST':
            # Добавление нового отзыва
            try:
                body_data = json.loads(event.get('body', '{}'))
            except json.JSONDecodeError:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid JSON in request body'})
                }
            
            boiler_id = body_data.get('boiler_id')
            name = body_data.get('name', '').strip()
            email = body_data.get('email', '').strip()
            rating = body_data.get('rating')
            comment = body_data.get('comment', '').strip()
            
            # Валидация
            if not all([boiler_id, name, rating, comment]):
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все обязательные поля'})
                }
            
            if not isinstance(rating, int) or not (1 <= rating <= 5):
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Рейтинг должен быть от 1 до 5'})
                }
            
            # Сохранение отзыва
            cursor.execute("""
                INSERT INTO reviews (boiler_id, name, email, rating, comment)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (int(boiler_id), name, email or None, int(rating), comment))
            
            review_id = cursor.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Отзыв успешно добавлен',
                    'review_id': review_id
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
            
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Internal error: {str(e)}'})
        }
    finally:
        if 'conn' in locals():
            cursor.close()
            conn.close()