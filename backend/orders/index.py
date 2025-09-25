import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с заказами и заявками
    POST /orders - создать новый заказ
    POST /contact - отправить контактную заявку
    """
    method = event.get('httpMethod', 'POST')
    
    # Обработка CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
        body_data = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Определяем тип запроса по пути или параметрам
        path = event.get('path', '/')
        action_type = body_data.get('type', 'order')
        
        if action_type == 'contact' or 'contact' in path:
            # Контактная заявка
            name = body_data.get('name', '').strip()
            phone = body_data.get('phone', '').strip()
            email = body_data.get('email', '').strip()
            message = body_data.get('message', '').strip()
            
            if not all([name, phone, message]):
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все обязательные поля (имя, телефон, сообщение)'})
                }
            
            cursor.execute("""
                INSERT INTO contact_requests (name, phone, email, message)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (name, phone, email or None, message))
            
            request_id = cursor.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.',
                    'request_id': request_id
                })
            }
        
        else:
            # Заказ котлов
            name = body_data.get('name', '').strip()
            phone = body_data.get('phone', '').strip()
            email = body_data.get('email', '').strip()
            address = body_data.get('address', '').strip()
            items = body_data.get('items', [])
            user_location = body_data.get('user_location', '').strip()
            
            if not all([name, phone, items]):
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все обязательные поля (имя, телефон) и добавьте товары'})
                }
            
            if not isinstance(items, list) or len(items) == 0:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Добавьте хотя бы один товар в заказ'})
                }
            
            # Подсчет общей стоимости
            total_amount = sum(item.get('price', 0) for item in items)
            
            cursor.execute("""
                INSERT INTO orders (name, phone, email, address, total_amount, items, user_location)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (name, phone, email or None, address or None, float(total_amount), 
                  json.dumps(items), user_location or None))
            
            order_id = cursor.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'Заказ #{order_id} успешно оформлен! Мы свяжемся с вами в течение часа.',
                    'order_id': order_id,
                    'total_amount': total_amount
                })
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