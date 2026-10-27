from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ScreenConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.screen_slug = self.scope["url_route"]["kwargs"][
            "screen_slug"
        ]

        self.group_name = f"ecran_{self.screen_slug}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

    async def announcement_event(self, event):
        await self.send_json(event)