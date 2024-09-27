
import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # return await super().connect()
        self.accept()
        self.send(text_data=json.dumps({
            'type':'connection_established',
            'message':"Welcome",
        }))


# class ChatConsumer(WebsocketConsumer):
#     def connect(self):
#         # Log connection attempt
#         print(f"WebSocket connected: {self.scope['client']}")
        
#         self.accept()  # Accept the WebSocket connection
#         self.send(text_data=json.dumps({
#             'type': 'connection_established',
#             'message': "Welcome",
#         }))
    
#     def disconnect(self, close_code):
#         # Log disconnect event
#         print(f"WebSocket disconnected: {self.scope['client']}, code: {close_code}")
