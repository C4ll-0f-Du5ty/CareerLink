import json
from channels.generic.websocket import AsyncWebsocketConsumer
# from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async
from users.models import CustomUser, ChatMessage

class ChatConsumer(AsyncWebsocketConsumer):  # Use AsyncWebsocketConsumer
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # print('Data1: ', self.scope['user'])
    
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_username = data['sender']

        # print('Data2: ', self.scope['user'])
        
        Users = self.room_name.split("_")
        
        if sender_username == Users[0]:
            receiver_username = Users[1]
            if isinstance(sender_username, str):
                sender_username = Users[0]
        else:
            receiver_username = Users[0]
            sender_username = Users[1]

        # print("-----------------------------------------------------------")
        # print(message)
        # print()
        # print(Users, "---now------------Sender:",sender_username, "::::::::::::::Reciver:", receiver_username,"--------------------------------")
        sender = await sync_to_async(CustomUser.objects.get)(username=sender_username)
        receiver = await sync_to_async(CustomUser.objects.get)(username=receiver_username)

        # Create the message in the database
        await sync_to_async(ChatMessage.objects.create)(
            sender=sender,
            receiver=receiver,
            content=message
        )

        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'chat_message',
            'message': message,
            'sender': sender.id,
            'receiver': receiver.id,
        })

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']  # Get sender from event
        receiver = event['receiver']  # Get receiver from event
        # print("Event:   " ,event)

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'receiver': receiver, 
        }))
