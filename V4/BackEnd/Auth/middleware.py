# from channels.middleware import BaseMiddleware
# from urllib.parse import parse_qs
# from rest_framework_simplejwt.tokens import UntypedToken
# from rest_framework_simplejwt.exceptions import InvalidToken
# from django.contrib.auth import get_user_model
# from asgiref.sync import sync_to_async

# User = get_user_model()

# class TokenAuthMiddleware(BaseMiddleware):
#     async def __call__(self, scope, receive, send):
#         # Extract the token from the query string
#         query_string = parse_qs(scope["query_string"].decode())
#         token = query_string.get('token')

#         if token:
#             try:
#                 # Verify the token
#                 UntypedToken(token[0])
#                 # Retrieve the user from the token
#                 user = await sync_to_async(User.objects.get)(username="allem")  # Adjust this as per your actual token validation
#                 scope['user'] = user
#             except InvalidToken:
#                 # Invalid token; reject the connection
#                 scope['user'] = None
#         else:
#             scope['user'] = None

#         return await super().__call__(scope, receive, send)
