import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API админ-панели для управления заказами и отзывами
    GET /admin/orders - получить все заказы
    GET /admin/reviews - получить все отзывы 
    GET /admin/contacts - получить контактные заявки
    POST /admin/reviews/approve - одобрить отзыв
    DELETE /admin/reviews/{id} - удалить отзыв
    PATCH /admin/orders/{id} - изменить статус заказа
    """
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    
    # Обработка CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Простая авторизация админа (в реальном проекте нужен JWT)
    admin_token = event.get('headers', {}).get('X-Admin-Token', '')
    if admin_token != 'gasproject_admin_2024':
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized access'})
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
            if 'orders' in path:
                # Получить все заказы
                cursor.execute("""
                    SELECT id, name, phone, email, address, total_amount, 
                           items, user_location, status, created_at
                    FROM orders 
                    ORDER BY created_at DESC
                """)
                
                orders = []
                for row in cursor.fetchall():
                    orders.append({
                        'id': row[0],
                        'name': row[1],
                        'phone': row[2],
                        'email': row[3],
                        'address': row[4],
                        'total_amount': float(row[5]) if row[5] else 0,
                        'items': row[6],
                        'user_location': row[7],
                        'status': row[8],
                        'created_at': row[9].isoformat() if row[9] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'orders': orders})
                }
                
            elif 'reviews' in path:
                # Получить все отзывы
                cursor.execute("""
                    SELECT id, boiler_id, name, email, rating, comment, 
                           is_approved, created_at
                    FROM reviews 
                    ORDER BY created_at DESC
                """)
                
                reviews = []
                for row in cursor.fetchall():
                    reviews.append({
                        'id': row[0],
                        'boiler_id': row[1],
                        'name': row[2],
                        'email': row[3],
                        'rating': row[4],
                        'comment': row[5],
                        'is_approved': row[6],
                        'created_at': row[7].isoformat() if row[7] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'reviews': reviews})
                }
                
            elif 'contacts' in path:
                # Получить контактные заявки
                cursor.execute("""
                    SELECT id, name, phone, email, message, created_at
                    FROM contact_requests 
                    ORDER BY created_at DESC
                """)
                
                contacts = []
                for row in cursor.fetchall():
                    contacts.append({
                        'id': row[0],
                        'name': row[1],
                        'phone': row[2],
                        'email': row[3],
                        'message': row[4],
                        'created_at': row[5].isoformat() if row[5] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'contacts': contacts})
                }
        
        elif method == 'POST':
            if 'reviews/approve' in path:
                # Одобрить/отклонить отзыв
                body_data = json.loads(event.get('body', '{}'))
                review_id = body_data.get('review_id')
                is_approved = body_data.get('is_approved', True)
                
                cursor.execute("""
                    UPDATE reviews 
                    SET is_approved = %s 
                    WHERE id = %s
                """, (is_approved, review_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Статус отзыва обновлён'
                    })
                }
        
        elif method == 'PATCH':
            if 'orders/' in path:
                # Изменить статус заказа
                order_id = path.split('/')[-1]
                body_data = json.loads(event.get('body', '{}'))
                new_status = body_data.get('status')
                
                cursor.execute("""
                    UPDATE orders 
                    SET status = %s 
                    WHERE id = %s
                """, (new_status, order_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Статус заказа обновлён'
                    })
                }
        
        elif method == 'DELETE':
            if 'reviews/' in path:
                # Удалить отзыв
                review_id = path.split('/')[-1]
                
                cursor.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Отзыв удалён'
                    })
                }
        
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'})
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