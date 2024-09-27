
import json
from channels.generic.websocket import WebsocketConsumer

# class ChatConsumer(WebsocketConsumer):
    # def connect(self):
    #     # Log connection attempt
    #     print(f"WebSocket connected: {self.scope['client']}")
        
    #     self.accept()  # Accept the WebSocket connection
    #     self.send(text_data=json.dumps({
    #         'type': 'connection_established',
    #         'message': "Welcome",
    #     }))

    # def receive(self, text_data=None, bytes_data=None):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']
    #     if len(message.strip()) > 0:
    #         print("message:", message.strip())
    #         self.send(text_data=json.dumps({
    #             'type': 'chat',
    #         'message': message,
    #         }))
    
    # def disconnect(self, close_code):
    #     # Log disconnect event
    #     print(f"WebSocket disconnected: {self.scope['client']}, code: {close_code}")

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):  # Use AsyncWebsocketConsumer
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        message = json.loads(text_data)['message']

        # Send message to room group
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'chat_message',
            'message': message
        })

    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
