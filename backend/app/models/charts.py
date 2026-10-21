"""The response contract used by the chart demo in the frontend."""

from pydantic import BaseModel


class MonthlyActivity(BaseModel):
    month: str
    requests: int
    completed: int


class Channel(BaseModel):
    name: str
    count: int
    fill: str


class ChartSummary(BaseModel):
    activity: list[MonthlyActivity]
    channels: list[Channel]
