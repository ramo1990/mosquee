import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ScreenConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.screen_id = self.scope["url_route"]["kwargs"]["screen_id"]

        self.all_group = "ecrans_tous"
        self.screen_group = f"ecran_{self.screen_id}"

        await self.channel_layer.group_add(
            self.all_group,
            self.channel_name,
        )
        await self.channel_layer.group_add(
            self.screen_group,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.all_group,
            self.channel_name,
        )
        await self.channel_layer.group_discard(
            self.screen_group,
            self.channel_name,
        )

    async def announcement_event(self, event):
        await self.send_json(
            {
                "event": event["event"],
                "announcement": event["announcement"],
            }
        )